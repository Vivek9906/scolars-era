// scholars-era/backend/middleware/auth.js
"use strict";

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");

/**
 * protect — verifies JWT from Authorization header or cookie,
 * then attaches the full user document to req.user.
 */
async function protect(req, res, next) {
  try {
    let token;

    // 1. Read token from Authorization: Bearer <token>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // 2. Fallback to httpOnly cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError("You are not logged in. Please log in to access this resource.", 401));
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Check user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError("The user belonging to this token no longer exists.", 401));
    }

    // 5. Check if password was changed after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError("Password was recently changed. Please log in again.", 401));
    }

    // Attach user to request
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * restrictTo — factory that returns middleware allowing only specified roles.
 * @param {...string} roles - allowed roles (e.g. 'admin')
 */
function restrictTo(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }
    next();
  };
}

module.exports = { protect, restrictTo };
