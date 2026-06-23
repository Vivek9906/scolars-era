// scholars-era/backend/controllers/authController.js
"use strict";

const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const AppError = require("../utils/AppError");

// ── Validation rule sets ──────────────────────────────────────────────────────
const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

const loginRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required"),
];

// ── Helper: sign JWT and set cookie ──────────────────────────────────────────
function sendTokenResponse(user, statusCode, res) {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  const cookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("token", token, cookieOptions);

  // Remove password before sending user data
  const userData = user.toObject ? user.toObject() : { ...user };
  delete userData.password;

  res.status(statusCode).json({
    success: true,
    token,
    data: userData,
  });
}

// ── POST /api/auth/register ───────────────────────────────────────────────────
async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMap = {};
      errors.array().forEach((e) => { errorMap[e.path] = e.msg; });
      return res.status(422).json({ success: false, message: "Validation failed", errors: errorMap });
    }

    const { name, email, password } = req.body;

    // Check for duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return next(new AppError("Email already exists", 409));
    }

    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
}

// ── POST /api/auth/login ──────────────────────────────────────────────────────
async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMap = {};
      errors.array().forEach((e) => { errorMap[e.path] = e.msg; });
      return res.status(422).json({ success: false, message: "Validation failed", errors: errorMap });
    }

    const { email, password } = req.body;

    // Find user with password (select: false by default)
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Invalid email or password", 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
}

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
function logout(req, res) {
  res.cookie("token", "loggedout", {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000), // expire in 5 seconds
    sameSite: "strict",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
}

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

module.exports = { registerRules, loginRules, register, login, logout, getMe };
