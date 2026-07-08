// scholars-era/backend/services/emailService.js
"use strict";

const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

// ── Create reusable transporter (lazy — only if credentials are configured) ───
const PLACEHOLDER_USERS = ['your@gmail.com', 'your_email@gmail.com', ''];

function isSmtpConfigured() {
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();
  return user && pass && !PLACEHOLDER_USERS.includes(user) && pass !== 'your_app_password';
}

let _transporter = null;
function getTransporter() {
  if (!isSmtpConfigured()) return null;
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return _transporter;
}

// ── Brand colors (matched to style.css) ──────────────────────────────────────
const BRAND_DARK_TEAL = "#004D40";
const BRAND_GOLD = "#FFC107";
const BRAND_GOLD_DARK = "#FF9800";

// ── Send notification to admin ────────────────────────────────────────────────
async function sendContactEmail({ name, email, phone, subject, message, submissionId }) {
  try {
    const timestamp = new Date().toLocaleString("en-GB", { timeZone: "UTC" });
    const mailtoReply = `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);max-width:600px;">
        <!-- Header -->
        <tr><td style="background:${BRAND_DARK_TEAL};padding:30px 40px;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">
            📬 New Contact Form Submission
          </h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">
            scholars Fix — Contact Notification
          </p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:35px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
              <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">From</span><br>
              <span style="font-size:16px;font-weight:600;color:#1a1a1a;">${name}</span>
            </td></tr>
            <tr><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
              <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Email</span><br>
              <a href="mailto:${email}" style="font-size:15px;color:${BRAND_DARK_TEAL};text-decoration:none;">${email}</a>
            </td></tr>
            <tr><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
              <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Phone</span><br>
              <span style="font-size:15px;color:#1a1a1a;">${phone}</span>
            </td></tr>
            <tr><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
              <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Subject</span><br>
              <span style="font-size:15px;font-weight:600;color:#1a1a1a;">${subject}</span>
            </td></tr>
            <tr><td style="padding:16px 0;">
              <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Message</span><br>
              <div style="margin-top:10px;padding:16px;background:#f9f9f9;border-left:4px solid ${BRAND_GOLD};border-radius:6px;font-size:15px;line-height:1.7;color:#444;">
                ${message.replace(/\n/g, "<br>")}
              </div>
            </td></tr>
          </table>
          <!-- Reply Button -->
          <div style="text-align:center;margin-top:28px;">
            <a href="${mailtoReply}" style="display:inline-block;padding:13px 32px;background:linear-gradient(90deg,${BRAND_GOLD},${BRAND_GOLD_DARK});color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:50px;letter-spacing:0.5px;">
              ↩ Reply to ${name}
            </a>
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9f9f9;padding:18px 40px;border-top:1px solid #ebebeb;">
          <p style="margin:0;font-size:12px;color:#999;">
            Submission ID: <code style="background:#eee;padding:2px 6px;border-radius:4px;">${submissionId}</code>
            &nbsp;|&nbsp; Received: ${timestamp} UTC
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const mailer = getTransporter();
    if (!mailer) {
      logger.warn('sendContactEmail: SMTP not configured — skipping email (set SMTP_USER and SMTP_PASS in .env)');
      return;
    }
    await mailer.sendMail({
      from: process.env.EMAIL_FROM || '"scholars Fix" <noreply@scholarsfix.com>',
      to: process.env.ADMIN_EMAIL,
      subject: `[Contact] ${subject} — from ${name}`,
      html,
    });

    logger.info(`Contact notification email sent for submission ${submissionId}`);
  } catch (err) {
    logger.error(`sendContactEmail failed: ${err.message}`);
  }
}

// ── Send confirmation to the person who submitted ─────────────────────────────
async function sendConfirmationEmail({ name, email }) {
  try {
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);max-width:600px;">
        <!-- Header -->
        <tr><td style="background:${BRAND_DARK_TEAL};padding:36px 40px;text-align:center;">
          <div style="font-size:36px;margin-bottom:12px;">🎓</div>
          <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">scholars Fix</h1>
          <p style="margin:6px 0 0;color:${BRAND_GOLD};font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">We Fix Learnings</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px 40px 30px;">
          <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#1a1a1a;">Hi ${name}! 👋</h2>
          <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#555;">
            Thank you for reaching out to <strong style="color:${BRAND_DARK_TEAL};">scholars Fix</strong>. We've received your message and one of our academic counsellors will get back to you within <strong>24 hours</strong>.
          </p>
          <div style="background:#FFFBF0;border:1px solid rgba(255,193,7,0.3);border-radius:10px;padding:20px 24px;margin:24px 0;">
            <p style="margin:0;font-size:14px;color:#555;line-height:1.7;">
              ⏰ <strong>Expected response time:</strong> Within 24 hours (Mon–Sat)<br>
              📞 <strong>Urgent queries:</strong> Call us at <a href="tel:+447501298113" style="color:${BRAND_DARK_TEAL};font-weight:600;">+447501298113</a><br>
              ✉️ <strong>Email:</strong> <a href="mailto:info@company.com" style="color:${BRAND_DARK_TEAL};">info@company.com</a>
            </p>
          </div>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#555;">
            While you wait, feel free to explore our courses and university partnerships on our website.
          </p>
          <div style="text-align:center;">
            <a href="${process.env.NODE_ENV === "production" ? "https://scholarsfix.com" : "http://localhost:" + (process.env.PORT || 3000)}" 
               style="display:inline-block;padding:13px 32px;background:linear-gradient(90deg,${BRAND_GOLD},${BRAND_GOLD_DARK});color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:50px;letter-spacing:0.5px;">
              Visit Our Website →
            </a>
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:${BRAND_DARK_TEAL};padding:24px 40px;text-align:center;">
          <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.6);">
            © ${new Date().getFullYear()} scholars Fix. All rights reserved.
          </p>
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);">
            FLAT 2, 8 LYNFORD GARDEN 1G3 9LY
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const mailer = getTransporter();
    if (!mailer) {
      logger.warn('sendConfirmationEmail: SMTP not configured — skipping email (set SMTP_USER and SMTP_PASS in .env)');
      return;
    }
    await mailer.sendMail({
      from: process.env.EMAIL_FROM || '"scholars Fix" <noreply@scholarsfix.com>',
      to: email,
      subject: "✅ We received your message — scholars Fix",
      html,
    });

    logger.info(`Confirmation email sent to ${email}`);
  } catch (err) {
    logger.error(`sendConfirmationEmail failed: ${err.message}`);
  }
}

module.exports = { sendContactEmail, sendConfirmationEmail };
