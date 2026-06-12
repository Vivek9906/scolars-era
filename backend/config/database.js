// scolars-era/backend/config/database.js
"use strict";

const mongoose = require("mongoose");
const logger = require("../utils/logger");

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

async function connectWithRetry(attempt = 1) {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    logger.info(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`);
    if (attempt < MAX_RETRIES) {
      logger.info(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectWithRetry(attempt + 1);
    }
    throw new Error(`Could not connect to MongoDB after ${MAX_RETRIES} attempts.`);
  }
}

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected. Attempting reconnect...");
  connectWithRetry().catch((err) =>
    logger.error(`Reconnect failed: ${err.message}`)
  );
});

mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB error: ${err.message}`);
});

module.exports = connectWithRetry;
