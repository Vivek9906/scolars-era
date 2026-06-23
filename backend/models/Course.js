// scholars-era/backend/models/Course.js
"use strict";

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      required: true
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Technology", "Business", "Design", "Science", "Education", "Arts", "Language", "Other"],
        message: "Invalid category",
      },
    },
    level: {
      type: String,
      required: [true, "Level is required"],
      enum: {
        values: ["Beginner", "Intermediate", "Advanced"],
        message: "Level must be Beginner, Intermediate, or Advanced",
      },
    },
    durationWeeks: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 week"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
    thumbnail: {
      type: String,
      default: "/assets/images/course1.jpeg",
    },
    features: [{ type: String, trim: true }],
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
    // ── Legacy field (kept for backward compat) ───────────────────────────────
    enrollmentDeadline: {
      type: Date,
      default: null,
    },
    // ── Registration Deadline (Part 2A) ───────────────────────────────────────
    // When set, the frontend shows a deadline badge:
    //   • More than 31 days out → shows "Register before DD Month YYYY"
    //   • Within 31 days        → shows live countdown "Xd Xh Xm Xs"
    //   • Passed                → shows "Registration Closed"
    //   • null                  → nothing shown
    registrationDeadline: {
      type: Date,
      default: null,
    },
    deadlineLabel: {
      type: String,
      trim: true,
      maxlength: [100, "Deadline label cannot exceed 100 characters"],
      default: null,
      // Human-readable override e.g. "Register before 30th September"
      // If set, this displays instead of auto-generated text.
      // If null, auto-generate from registrationDeadline date.
    },
  },
  { timestamps: true }
);

// Indexes
courseSchema.index({ isActive: 1, sortOrder: 1 });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ slug: 1 });
courseSchema.index({ enrollmentDeadline: 1 });
courseSchema.index({ registrationDeadline: 1 });

// Pre-save: auto-slug + auto isFree
courseSchema.pre("validate", function (next) {
  // Generate slug
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // Handle isFree
  if (this.price !== undefined) {
    this.isFree = this.price === 0;
  }

  next();
});

// Pre-findOneAndUpdate: keep isFree in sync
courseSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update && update.price !== undefined) {
    update.isFree = update.price === 0;
  }
  next();
});

module.exports = mongoose.model("Course", courseSchema);
