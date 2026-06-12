// scolars-era/backend/utils/logger.js
"use strict";

const path = require("path");
const { createLogger, format, transports } = require("winston");

const { combine, timestamp, colorize, printf, json } = format;

const consoleFormat = printf(({ level, message, timestamp: ts }) => {
  return `${ts} [${level}]: ${message}`;
});

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
  transports: [
    // Error-only file log
    new transports.File({
      filename: path.join(__dirname, "../../backend/logs/error.log"),
      level: "error",
    }),
    // Combined log (all levels)
    new transports.File({
      filename: path.join(__dirname, "../../backend/logs/combined.log"),
    }),
  ],
});

// In development, also log colourised output to the console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "HH:mm:ss" }),
        consoleFormat
      ),
    })
  );
}

module.exports = logger;
