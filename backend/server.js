// scolars-era/backend/server.js
"use strict";

require('dotenv').config({ path: __dirname + '/../.env' });
const logger = require("./utils/logger");
const connectDB = require("./config/database");
const app = require("./app");

const PORT = process.env.PORT || 5000;

// Handle uncaught synchronous exceptions before anything else
process.on("uncaughtException", (err) => {
  logger.error(`UNCAUGHT EXCEPTION: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

console.log("SERVER MONGO_URI:", process.env.MONGO_URI);
// Connect to MongoDB then start HTTP server
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      logger.info(`✅ Scolars Fix running on http://localhost:${PORT} [${process.env.NODE_ENV}]`);
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
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((err) => {
    logger.error(`Failed to connect to MongoDB: ${err.message}`);
    process.exit(1);
  });
