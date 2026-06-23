// scholars-era/backend/controllers/coursesController.js
"use strict";

const { body, validationResult } = require("express-validator");
const Course = require("../models/Course");
const AppError = require("../utils/AppError");

// ── Validation rules (reused by admin routes) ─────────────────────────────────
const courseValidationRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("shortDescription")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Short description cannot exceed 300 characters"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category")
    .notEmpty().withMessage("Category is required")
    .isIn(["Technology", "Business", "Design", "Science", "Education", "Arts", "Language", "Other"])
    .withMessage("Invalid category"),
  body("level")
    .notEmpty().withMessage("Level is required")
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Level must be Beginner, Intermediate, or Advanced"),
  body("durationWeeks")
    .isInt({ min: 1 }).withMessage("Duration must be a positive integer"),
  body("price")
    .isFloat({ min: 0 }).withMessage("Price must be 0 or greater"),
];

// ── Deadline status computation (Part 2B) ────────────────────────────────────
function computeDeadlineStatus(course) {
  // Prefer registrationDeadline; fall back to legacy enrollmentDeadline
  const deadlineDate = course.registrationDeadline || course.enrollmentDeadline;
  if (!deadlineDate) return null;

  const now = new Date();
  const deadline = new Date(deadlineDate);
  const diffMs = deadline - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { type: "closed", label: "Registration Closed", daysLeft: 0 };
  }

  if (diffDays <= 31) {
    return {
      type: "countdown",
      label: course.deadlineLabel || "Registration closes in",
      daysLeft: diffDays,
      deadline: deadlineDate,
    };
  }

  // More than 31 days away — show static label
  const formatted = deadline.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return {
    type: "static",
    label: course.deadlineLabel || `Register before ${formatted}`,
    daysLeft: diffDays,
    deadline: deadlineDate,
  };
}

// ── Attach deadlineStatus to a plain course object ────────────────────────────
function attachDeadlineStatus(courseObj) {
  return { ...courseObj, deadlineStatus: computeDeadlineStatus(courseObj) };
}

// ── GET /api/courses ──────────────────────────────────────────────────────────
async function getCourses(req, res, next) {
  try {
    const { category, level, isFree, page = 1, limit = 12 } = req.query;
    const filterActive = { isActive: true };

    if (category) filterActive.category = category;
    if (level) filterActive.level = level;
    if (isFree !== undefined) filterActive.isFree = isFree === "true";

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    let filter = filterActive;
    let [courses, total] = await Promise.all([
      Course.find(filter)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      Course.countDocuments(filter),
    ]);

    // If no active courses exist, return all courses (useful during development)
    if (total === 0) {
      const { isActive, ...rest } = filterActive;
      filter = rest;
      [courses, total] = await Promise.all([
        Course.find(filter)
          .sort({ sortOrder: 1, createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit, 10))
          .lean(),
        Course.countDocuments(filter),
      ]);
    }

    const enriched = courses.map(attachDeadlineStatus);

    res.status(200).json({
      success: true,
      data: enriched,
      meta: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / parseInt(limit, 10)),
        limit: parseInt(limit, 10),
      },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/courses/:slug ────────────────────────────────────────────────────
async function getCourseBySlug(req, res, next) {
  try {
    const course = await Course.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!course) {
      return next(new AppError("Course not found", 404));
    }
    res.status(200).json({ success: true, data: attachDeadlineStatus(course) });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/admin/courses ───────────────────────────────────────────────────
async function createCourse(req, res, next) {
  try {
    // Check express-validator errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errMap = {};
      errors.array().forEach((e) => { errMap[e.path || e.param] = e.msg; });
      return res.status(422).json({ success: false, errors: errMap });
    }

    // Sync enrollmentDeadline → registrationDeadline if only old field sent
    const body = { ...req.body };
    if (body.enrollmentDeadline && !body.registrationDeadline) {
      body.registrationDeadline = body.enrollmentDeadline;
    }

    const course = await Course.create(body);
    res.status(201).json({
      success: true,
      message: "Course created",
      data: attachDeadlineStatus(course.toObject()),
    });
  } catch (err) {
    // Handle Mongoose duplicate key (slug collision)
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        errors: { title: "A course with a similar title already exists. Please use a more specific title." },
      });
    }
    next(err);
  }
}

// ── PUT /api/admin/courses/:id ────────────────────────────────────────────────
async function updateCourse(req, res, next) {
  try {
    // Sync enrollmentDeadline → registrationDeadline if only old field sent
    const body = { ...req.body };
    if (body.enrollmentDeadline && !body.registrationDeadline) {
      body.registrationDeadline = body.enrollmentDeadline;
    }

    const course = await Course.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!course) return next(new AppError("Course not found", 404));
    res.status(200).json({
      success: true,
      message: "Course updated",
      data: attachDeadlineStatus(course),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        errors: { title: "A course with a similar title already exists." },
      });
    }
    next(err);
  }
}

// ── DELETE /api/admin/courses/:id ─────────────────────────────────────────────
async function deleteCourse(req, res, next) {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return next(new AppError("Course not found", 404));
    res.status(200).json({ success: true, message: "Course deleted" });
  } catch (err) {
    next(err);
  }
}

// ── Admin: GET ALL (including inactive) ────────────────────────────────────────
async function getAdminCourses(req, res, next) {
  try {
    const courses = await Course.find({})
      .sort({ createdAt: -1 })
      .lean();
    const enriched = courses.map(attachDeadlineStatus);
    res.json({ success: true, data: enriched });
  } catch (err) { next(err); }
}

// ── Admin: GET SINGLE COURSE BY ID ────────────────────────────────────────────
async function getAdminCourseById(req, res, next) {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!course) return next(new AppError("Course not found", 404));
    res.json({ success: true, data: attachDeadlineStatus(course) });
  } catch (err) { next(err); }
}

module.exports = {
  courseValidationRules,
  getCourses,
  getCourseBySlug,
  getAdminCourses,
  getAdminCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
