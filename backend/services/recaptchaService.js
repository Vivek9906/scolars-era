// scholars-era/backend/services/recaptchaService.js
"use strict";

const axios = require("axios");
const AppError = require("../utils/AppError");

/**
 * verifyRecaptcha — verifies a reCAPTCHA v3 token with Google's API.
 * @param {string} token - the token from the client
 * @returns {Promise<number>} score between 0.0 and 1.0
 * @throws AppError if the Google API call fails
 */
async function verifyRecaptcha(token) {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    throw new AppError("reCAPTCHA secret key is not configured", 500);
  }

  const params = new URLSearchParams({
    secret: process.env.RECAPTCHA_SECRET_KEY,
    response: token,
  });

  let response;
  try {
    response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      params.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" }, timeout: 5000 }
    );
  } catch (err) {
    throw new AppError(`reCAPTCHA API call failed: ${err.message}`, 502);
  }

  const { success, score, "error-codes": errorCodes } = response.data;

  if (!success) {
    throw new AppError(
      `reCAPTCHA verification failed: ${(errorCodes || []).join(", ")}`,
      400
    );
  }

  return score; // float 0.0–1.0
}

module.exports = { verifyRecaptcha };
