// scolars-era/backend/controllers/universitiesController.js
"use strict";

const University = require("../models/University");
const AppError = require("../utils/AppError");

// ── GET /api/universities ─────────────────────────────────────────────────────
async function getUniversities(req, res, next) {
  try {
    const { partnershipType } = req.query;
    const filter = { isActive: true };
    if (partnershipType) filter.partnershipType = partnershipType;

    const universities = await University.find(filter)
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: universities,
      meta: { total: universities.length },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/universities/:id ────────────────────────────────────────────────
async function getUniversityById(req, res, next) {
  try {
    const university = await University.findById(req.params.id).lean();

    if (!university || !university.isActive) {
      return next(new AppError("University not found", 404));
    }

    res.status(200).json({ success: true, data: university });
  } catch (err) {
    next(err);
  }
}

// ── Admin: GET ALL (including inactive) ────────────────────────────────────────
async function getAdminUniversities(req, res, next) {
  try {
    const universities = await University.find({}).sort({ sortOrder: 1, name: 1 }).lean();
    res.status(200).json({ success: true, data: universities });
  } catch (err) { next(err); }
}

// ── Admin: CREATE ─────────────────────────────────────────────────────────────
async function createUniversity(req, res, next) {
  try {
    const university = await University.create(req.body);
    res.status(201).json({ success: true, data: university });
  } catch (err) { next(err); }
}

// ── Admin: UPDATE ─────────────────────────────────────────────────────────────
async function updateUniversity(req, res, next) {
  try {
    const university = await University.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!university) return next(new AppError("University not found", 404));
    res.status(200).json({ success: true, data: university });
  } catch (err) { next(err); }
}

// ── Admin: DELETE ─────────────────────────────────────────────────────────────
async function deleteUniversity(req, res, next) {
  try {
    const university = await University.findByIdAndDelete(req.params.id);
    if (!university) return next(new AppError("University not found", 404));
    res.status(200).json({ success: true, message: "University deleted" });
  } catch (err) { next(err); }
}

module.exports = {
  getUniversities,
  getUniversityById,
  getAdminUniversities,
  createUniversity,
  updateUniversity,
  deleteUniversity,
};
