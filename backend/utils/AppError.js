// scholars-era/backend/utils/AppError.js
"use strict";

/**
 * AppError — operational errors that can be safely sent to the client.
 * Non-operational (programming) errors are handled by the global error handler.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = true;

    // Capture a clean stack trace (excludes this constructor)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
