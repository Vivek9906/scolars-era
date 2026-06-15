// scolars-era/backend/server.js
"use strict";

require('dotenv').config({ path: __dirname + '/../.env' });
const logger = require("./utils/logger");
const connectDB = require("./config/database");
const app = require("./app");

const PORT = process.env.PORT || 3000;

// Handle uncaught synchronous exceptions before anything else
process.on("uncaughtException", (err) => {
  logger.error(`UNCAUGHT EXCEPTION: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

// Start the HTTP server first, then try MongoDB
const server = app.listen(PORT, () => {
  logger.info(`✅ Scolars Lift running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// Try connecting to MongoDB (non-fatal if unavailable)
connectDB()
  .then(() => {
    logger.info("MongoDB connection established successfully");
  })
  .catch((err) => {
    logger.warn(`⚠️  MongoDB not available: ${err.message}`);
    logger.warn("⚠️  Server running WITHOUT database — API endpoints will return errors, but frontend is accessible.");
  });

// Graceful SIGTERM shutdown (Docker / PM2 signal)
process.on("SIGTERM", () => {
  logger.info("SIGTERM received — closing HTTP server gracefully...");
  server.close(() => {
    logger.info("HTTP server closed. Exiting.");
    process.exit(0);
  });
});

// Graceful SIGINT shutdown (Ctrl+C in dev)
process.on("SIGINT", () => {
  logger.info("SIGINT received — shutting down...");
  server.close(() => {
    logger.info("HTTP server closed. Exiting.");
    process.exit(0);
  });
});

// Unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error(`UNHANDLED REJECTION at: ${promise}, reason: ${reason}`);
});

