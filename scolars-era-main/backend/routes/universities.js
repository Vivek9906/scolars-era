// scolars-era/backend/routes/universities.js
"use strict";

const express = require("express");
const router = express.Router();

const {
  getUniversities,
  getUniversityById,
} = require("../controllers/universitiesController");

// GET /api/universities         — public, list all active universities
router.get("/", getUniversities);

// GET /api/universities/:id     — public, single university by id (Mongo ObjectId)
// Keep compatibility with older frontend that might call /api/universities/:id
router.get("/id/:id", getUniversityById);
router.get("/:id", getUniversityById);


// GET /api/universities/:slug   — public, single university by slug
router.get("/slug/:slug", async (req, res, next) => {
  try {
    const university = await require("../models/University").findOne({
      slug: req.params.slug,
      isActive: true,
    }).lean();

    if (!university) return next(new (require("../utils/AppError"))("University not found", 404));

    res.status(200).json({ success: true, data: university });
  } catch (err) {
    next(err);
  }
});



module.exports = router;
