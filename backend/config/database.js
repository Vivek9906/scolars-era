// scholars-era/backend/config/database.js
"use strict";

const mongoose = require("mongoose");
const logger = require("../utils/logger");

// Global cached connection state
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    logger.info("Using cached MongoDB connection");
    return;
  }

  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    isConnected = mongoose.connection.readyState === 1;
    logger.info("MongoDB connection already established or connecting");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      minPoolSize: 5, // Maintain up to 5 socket connections
      maxPoolSize: 50, // Maintain up to 50 socket connections
    });

    isConnected = conn.connections[0].readyState === 1;
    logger.info(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    throw err;
  }
};

mongoose.connection.on("connected", () => {
  logger.info("MongoDB connection event: Connected");
});

mongoose.connection.on("reconnected", () => {
  logger.info("MongoDB connection event: Reconnected");
});

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  logger.warn("MongoDB connection event: Disconnected");
});

mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB connection event Error: ${err.message}`);
});

module.exports = connectDB;
