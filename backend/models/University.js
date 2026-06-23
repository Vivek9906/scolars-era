// scholars-era/backend/models/University.js
"use strict";

const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "University name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      required: true
    },
    logo: {
      type: String,
      default: "/assets/images/clg.jpeg",
    },
    websiteUrl: {
      type: String,
      trim: true,
      default: null,
    },
    country: {
      type: String,
      trim: true,
      required: [true, "Country is required"],
    },
    partnershipType: {
      type: String,
      enum: {
        values: ["Academic", "Corporate", "NGO", "Government"],
        message: "Partnership type must be one of: Academic, Corporate, NGO, Government",
      },
      default: "Academic",
    },
    description: {
      type: String,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    established: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name
universitySchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});

module.exports = mongoose.model("University", universitySchema);
