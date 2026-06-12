// scolars-era/backend/routes/courses.js
"use strict";

const express = require("express");
const router = express.Router();

const { getCourses, getCourseBySlug } = require("../controllers/coursesController");

// GET /api/courses          — public, list all active courses
router.get("/", getCourses);

// GET /api/courses/:slug    — public, single course by slug
router.get("/:slug", getCourseBySlug);

module.exports = router;
