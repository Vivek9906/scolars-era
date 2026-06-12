// scolars-era/backend/routes/testimonials.js
"use strict";

const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");
const { protect, restrictTo } = require("../middleware/auth");
const { getTestimonials } = require("../controllers/testimonialsController");

// GET /api/testimonials
router.get("/", getTestimonials);

// POST /api/testimonials — admin only (used by admin panel)
router.post("/", protect, restrictTo("admin"), async (req, res, next) => {
  try {
    const t = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: t });
  } catch (err) { next(err); }
});

module.exports = router;

