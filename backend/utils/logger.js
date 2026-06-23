// scholars-era/backend/utils/logger.js
"use strict";

const path = require("path");
const { createLogger, format, transports } = require("winston");

const { combine, timestamp, colorize, printf, json } = format;

const consoleFormat = printf(({ level, message, timestamp: ts }) => {
  return `${ts} [${level}]: ${message}`;
});

const transportsList = [];

// On Vercel, the filesystem is read-only, so we disable file logs
if (!process.env.VERCEL) {
  transportsList.push(
    new transports.File({
      filename: path.join(__dirname, "../../backend/logs/error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(__dirname, "../../backend/logs/combined.log"),
    })
  );
}

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
  transports: transportsList.length > 0 ? transportsList : [new transports.Console()],
});

// In development or Vercel, log to the console
if (process.env.NODE_ENV !== "production" || process.env.VERCEL) {
  // Check if console transport already added
  if (!logger.transports.some(t => t.name === 'console')) {
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
}

module.exports = logger;
