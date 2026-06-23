// scholars-era/backend/controllers/contactController.js
"use strict";

const { body, validationResult } = require("express-validator");
const Contact = require("../models/Contact");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

// ── Validation rules ──────────────────────────────────────────────────────────
const contactValidationRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters")
    .matches(/^[a-zA-Z\s\-'.]+$/).withMessage("Name contains invalid characters"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("phone")
    .optional({ checkFalsy: true })
    .matches(/^[+\d\s\-()]{7,20}$/).withMessage("Please provide a valid phone number"),
  body("subject")
    .trim()
    .notEmpty().withMessage("Subject is required")
    .isLength({ max: 200 }).withMessage("Subject cannot exceed 200 characters"),
  body("message")
    .trim()
    .notEmpty().withMessage("Message is required")
    .isLength({ max: 2000 }).withMessage("Message cannot exceed 2000 characters"),
  body("recaptchaToken").optional().isString(),
];

// ── POST /api/contact ─────────────────────────────────────────────────────────
async function submitContact(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMap = {};
      errors.array().forEach((e) => { errorMap[e.path] = e.msg; });
      return res.status(422).json({ success: false, message: "Validation failed", errors: errorMap });
    }

    const { name, email, phone, subject, message, recaptchaToken } = req.body;

    // Optional reCAPTCHA check
    if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
      try {
        const { verifyRecaptcha } = require("../services/recaptchaService");
        const score = await verifyRecaptcha(recaptchaToken);
        if (score < 0.3) {
          return res.status(400).json({ success: false, message: "reCAPTCHA verification failed. Please try again." });
        }
      } catch (err) {
        logger.warn("reCAPTCHA check failed (non-fatal):", err.message);
      }
    }

    const contact = await Contact.create({
      name, email, phone, subject, message,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // Fire-and-forget emails
    try {
      const { sendContactEmail, sendConfirmationEmail } = require("../services/emailService");
      Promise.all([
        sendContactEmail({ name, email, phone, subject, message, submissionId: contact._id }),
        sendConfirmationEmail({ name, email }),
      ]).catch((err) => logger.error("Email send error:", err.message));
    } catch (err) {
      logger.error("Email service error:", err.message);
    }

    res.status(201).json({
      success: true,
      message: "Thank you! We'll respond within 24 hours.",
      data: { id: contact._id },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/contact (admin) ──────────────────────────────────────────────────
async function getContacts(req, res, next) {
  try {
    const { status = "pending", page = 1, limit = 20 } = req.query;
    const filter = status === "all" ? {} : { status };

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [data, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)).lean(),
      Contact.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data,
      meta: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (err) {
    next(err);
  }
}

// ── PATCH /api/contact/:id/status (admin) ─────────────────────────────────────
async function updateContactStatus(req, res, next) {
  try {
    const validStatuses = ["pending", "read", "replied", "spam", "resolved"];
    const { status } = req.body;

    console.log(
      "[contactController] Updating contact",
      req.params.id,
      "to status:",
      status
    );

    if (!validStatuses.includes(status)) {
      return next(
        new AppError(
          `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
          400
        )
      );
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!contact) return next(new AppError("Contact not found", 404));

    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
}

module.exports = { contactValidationRules, submitContact, getContacts, updateContactStatus };
