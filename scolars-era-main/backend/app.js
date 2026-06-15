// scolars-era/backend/app.js
"use strict";

const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const morgan = require("morgan");

const securityHeaders = require("./middleware/securityHeaders");
const { apiLimiter, contactLimiter, authLimiter } = require("./middleware/rateLimiter");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const logger = require("./utils/logger");

// Route imports
const contactRoutes      = require("./routes/contact");
const coursesRoutes      = require("./routes/courses");
const testimonialsRoutes = require("./routes/testimonials");
const universitiesRoutes = require("./routes/universities");
const authRoutes         = require("./routes/auth");
const adminRoutes        = require("./routes/admin");

const app = express();

// ── 1. Trust proxy ────────────────────────────────────────────────────────────
app.set("trust proxy", 1);

// ── 2. Security headers (Helmet) ──────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:  ["'self'"],
        scriptSrc:   ["'self'", "'unsafe-inline'",
                      "https://cdnjs.cloudflare.com",
                      "https://www.google.com", "https://www.gstatic.com"],
        styleSrc:    ["'self'", "'unsafe-inline'",
                      "https://fonts.googleapis.com",
                      "https://cdnjs.cloudflare.com"],
        fontSrc:     ["'self'", "https://fonts.gstatic.com",
                      "https://cdnjs.cloudflare.com"],
        imgSrc:      ["'self'", "data:", "https:", "blob:"],
        connectSrc:  ["'self'"],
        frameSrc:    ["'self'", "https://www.google.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// ── 3. Custom security headers ────────────────────────────────────────────────
app.use(securityHeaders);

// ── 4. CORS ───────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000,http://localhost:5000")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow all origins to bypass Hostinger deployment issues
      return cb(null, true);
    },
    credentials: true,
  })
);

// ── 5. Cookie parser ──────────────────────────────────────────────────────────
app.use(cookieParser());

// ── 6. Body parsers ───────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── 7. Sanitization ───────────────────────────────────────────────────────────
app.use(mongoSanitize());
app.use(xss());

// ── 8. Compression ────────────────────────────────────────────────────────────
app.use(compression());

// ── 9. HTTP request logging ───────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined", {
    stream: { write: (msg) => logger.info(msg.trim()) },
  }));
}

// ── 10. STATIC FILES — must come BEFORE all routes ───────────────────────────
//  Express serves frontend/ as the web root.
//  /admin/index.html  → frontend/admin/index.html  ✓
//  /assets/css/admin.css → frontend/assets/css/admin.css ✓
app.use(
  express.static(path.join(__dirname, "..", "frontend"), {
    maxAge: process.env.NODE_ENV === "production" ? "1d" : 0,
    etag: true,
  })
);

// ── 11. Rate limiters ─────────────────────────────────────────────────────────
app.use("/api/", apiLimiter);
app.use("/api/contact", contactLimiter);
app.use("/api/auth", authLimiter);

// ── 12. API routes ────────────────────────────────────────────────────────────
app.use("/api/contact",      contactRoutes);
app.use("/api/courses",      coursesRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/universities", universitiesRoutes);
app.use("/api/auth",         authRoutes);
app.use("/api/admin",        adminRoutes);

// ── 13. Redirect helpers ──────────────────────────────────────────────────────
app.get("/admin",            (req, res) => res.redirect(301, "/admin/index.html"));
app.get("/admin.html",       (req, res) => res.redirect(301, "/admin/index.html"));
app.get("/book-appointment", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "frontend", "book-appointment.html"))
);

// ── 14. API 404 — unmatched /api/ routes only ─────────────────────────────────
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found: " + req.originalUrl,
  });
});

// ── 15. Frontend catch-all ────────────────────────────────────────────────────
//  express.static already handled all real files above.
//  This only fires for paths with no matching file (SPA-style routing).
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// ── 16. Global error handler — must be last ───────────────────────────────────
app.use(errorHandler);

module.exports = app;
