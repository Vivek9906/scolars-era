// scholars-era/backend/models/Testimonial.js
"use strict";

const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    studentRole: {
      type: String,
      required: [true, "Student role is required"],
      trim: true,
      maxlength: [100, "Role cannot exceed 100 characters"],
    },
    studentAvatar: {
      type: String,
      default: "/assets/images/00.jpeg",
    },
    content: {
      type: String,
      required: [true, "Testimonial content is required"],
      trim: true,
      maxlength: [1000, "Content cannot exceed 1000 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    courseRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
