// scolars-era/backend/controllers/testimonialsController.js
"use strict";

const Testimonial = require("../models/Testimonial");
const AppError = require("../utils/AppError");

// ── GET /api/testimonials ─────────────────────────────────────────────────────
async function getTestimonials(req, res, next) {
  try {
    const { featured } = req.query;
    const filter = { isActive: true };

    if (featured === "true") filter.isFeatured = true;

    const testimonials = await Testimonial.find(filter)
      .populate("courseRef", "title slug")
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: testimonials,
      meta: { total: testimonials.length },
    });
  } catch (err) {
    next(err);
  }
}

// ── Admin: GET ALL ────────────────────────────────────────────────────────────
async function getAdminTestimonials(req, res, next) {
  try {
    const testimonials = await Testimonial.find({})
      .populate("courseRef", "title slug")
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, data: testimonials });
  } catch (err) { next(err); }
}

// ── Admin: CREATE ─────────────────────────────────────────────────────────────
async function createTestimonial(req, res, next) {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (err) { next(err); }
}

// ── Admin: UPDATE ─────────────────────────────────────────────────────────────
async function updateTestimonial(req, res, next) {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) return next(new AppError("Testimonial not found", 404));
    res.status(200).json({ success: true, data: testimonial });
  } catch (err) { next(err); }
}

// ── Admin: DELETE ─────────────────────────────────────────────────────────────
async function deleteTestimonial(req, res, next) {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return next(new AppError("Testimonial not found", 404));
    res.status(200).json({ success: true, message: "Testimonial deleted" });
  } catch (err) { next(err); }
}

module.exports = {
  getTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
