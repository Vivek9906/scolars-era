// scolars-era/backend/middleware/rateLimiter.js
"use strict";

const rateLimit = require("express-rate-limit");

const jsonResponse = (message) => (req, res) => {
  res.status(429).json({
    success: false,
    message,
    retryAfter: res.getHeader("Retry-After"),
  });
};

/**
 * General API limiter — 100 requests per 15 minutes
 * Applied to all /api/ routes
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonResponse("Too many requests. Please try again after 15 minutes."),
});

/**
 * Contact form limiter — 5 submissions per 60 minutes
 * Applied only to POST /api/contact
 */
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonResponse(
    "Too many contact form submissions. Please wait before trying again."
  ),
});

/**
 * Auth limiter — 10 requests per 15 minutes
 * Applied to all /api/auth routes
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonResponse("Too many authentication attempts. Please try again later."),
});

module.exports = { apiLimiter, contactLimiter, authLimiter };
