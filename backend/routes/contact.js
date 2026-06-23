// scholars-era/backend/routes/contact.js
"use strict";

const express = require("express");
const router = express.Router();

const {
  contactValidationRules,
  submitContact,
  getContacts,
  updateContactStatus,
} = require("../controllers/contactController");

const { protect, restrictTo } = require("../middleware/auth");

// POST /api/contact  — public route (rate-limited in app.js)
router.post("/", contactValidationRules, submitContact);

// GET /api/contact  — admin only
router.get("/", protect, restrictTo("admin"), getContacts);

// PATCH /api/contact/:id  — admin only
router.patch("/:id/status", protect, restrictTo("admin"), updateContactStatus);

module.exports = router;
