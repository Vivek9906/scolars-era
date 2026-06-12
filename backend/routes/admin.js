// scolars-era/backend/routes/admin.js
"use strict";

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect, restrictTo } = require("../middleware/auth");

const uploadDir = process.env.VERCEL 
  ? path.join("/tmp", "uploads") 
  : path.join(__dirname, "../../frontend/assets/images");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});
const upload = multer({ storage: storage });

// Middleware to parse fields sent via FormData
function parseFormData(req, res, next) {
  if (req.body) {
    ['isActive', 'isFeatured', 'isFree'].forEach(field => {
      if (req.body[field] === 'true' || req.body[field] === 'on') req.body[field] = true;
      else if (req.body[field] === 'false' || req.body[field] === '') req.body[field] = false;
    });

    if (typeof req.body.features === 'string') {
      req.body.features = req.body.features.split('\n').map(s => s.trim()).filter(Boolean);
    }
  }
  
  if (req.file) {
    if (req.file.fieldname === 'thumbnail') req.body.thumbnail = `/assets/images/${req.file.filename}`;
    if (req.file.fieldname === 'logo') req.body.logo = `/assets/images/${req.file.filename}`;
    if (req.file.fieldname === 'avatar') req.body.studentAvatar = `/assets/images/${req.file.filename}`;
  }
  next();
}

// Import controllers
const {
  createCourse,
  updateCourse,
  deleteCourse,
  getAdminCourses,
  getAdminCourseById,
} = require("../controllers/coursesController");

const {
  createUniversity,
  updateUniversity,
  deleteUniversity,
  getAdminUniversities,
} = require("../controllers/universitiesController");

const {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAdminTestimonials,
} = require("../controllers/testimonialsController");

const {
  getContacts,
  updateContactStatus,
} = require("../controllers/contactController");

// ── All admin routes require auth + admin role ────────────────────────────────
router.use(protect, restrictTo("admin"));

// Courses
router.get("/courses", getAdminCourses);
router.get("/courses/:id", getAdminCourseById);
router.post("/courses", upload.single('thumbnail'), parseFormData, createCourse);
router.put("/courses/:id", upload.single('thumbnail'), parseFormData, updateCourse);
router.delete("/courses/:id", deleteCourse);

// Universities
router.get("/universities", getAdminUniversities);
router.post("/universities", upload.single('logo'), parseFormData, createUniversity);
router.put("/universities/:id", upload.single('logo'), parseFormData, updateUniversity);
router.delete("/universities/:id", deleteUniversity);

// Testimonials
router.get("/testimonials", getAdminTestimonials);
router.post("/testimonials", upload.single('avatar'), parseFormData, createTestimonial);
router.put("/testimonials/:id", upload.single('avatar'), parseFormData, updateTestimonial);
router.delete("/testimonials/:id", deleteTestimonial);

// Contacts (read + status only)
router.get("/contacts", getContacts);
router.patch("/contacts/:id/status", updateContactStatus);

module.exports = router;
