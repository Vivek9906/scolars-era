// scholars-era/backend/middleware/errorHandler.js
"use strict";

const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

// ── Transform known Mongoose/JWT errors into AppError ────────────────────────
function handleCastError(err) {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

function handleValidationError(err) {
  const errors = {};
  Object.values(err.errors).forEach((e) => {
    errors[e.path] = e.message;
  });
  const appErr = new AppError("Validation failed", 422);
  appErr.errors = errors;
  return appErr;
}

function handleDuplicateKeyError(err) {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`${field} already exists`, 409);
}

function handleJWTError() {
  return new AppError("Invalid token. Please log in again.", 401);
}

function handleJWTExpiredError() {
  return new AppError("Session expired. Please log in again.", 401);
}

// ── 404 handler for unmatched /api/ routes ───────────────────────────────────
function notFound(req, res, next) {
  if (req.path.startsWith("/api/")) {
    return next(new AppError(`Route not found: ${req.originalUrl}`, 404));
  }
  next();
}

// ── Global error handler ─────────────────────────────────────────────────────
function errorHandler(err, req, res, next) {
  let error = { ...err, message: err.message };

  // Mongoose CastError
  if (err.name === "CastError") error = handleCastError(err);
  // Mongoose ValidationError
  if (err.name === "ValidationError") error = handleValidationError(err);
  // MongoDB duplicate key
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  // JWT
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  const statusCode = error.statusCode || 500;
  const status = error.status || "error";

  // Log server errors
  if (statusCode >= 500) {
    logger.error(`${statusCode} ${err.message}`, {
      stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
      path: req.originalUrl,
      method: req.method,
    });
  }

  const response = {
    success: false,
    message: error.message || "Something went wrong",
  };

  if (error.errors) response.errors = error.errors;

  // Only expose stack in development
  if (process.env.NODE_ENV !== "production" && statusCode >= 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = { notFound, errorHandler };
