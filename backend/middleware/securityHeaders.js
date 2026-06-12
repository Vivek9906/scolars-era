// scolars-era/backend/middleware/securityHeaders.js
"use strict";

/**
 * Express middleware that adds extra security headers not covered by Helmet.
 */
function securityHeaders(req, res, next) {
  // Only add HSTS in production (HTTPS required)
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  next();
}

module.exports = securityHeaders;
