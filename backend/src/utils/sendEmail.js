const nodemailer = require("nodemailer");

// Create Gmail SMTP transporter using nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "creatokite123@gmail.com",
    pass: process.env.EMAIL_PASS || "", // Google App Password
  },
});

const sendLoginMail = async (email) => {
  if (!process.env.EMAIL_PASS) {
    console.log("⚠️ EMAIL_PASS not set in env. Skipping login notification email.");
    return;
  }
  try {
    const mailOptions = {
      from: `"CreatoKite" <${process.env.EMAIL_USER || "creatokite123@gmail.com"}>`,
      to: email,
      subject: "Security Alert: New Login to CreatoKite",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px;">
            <h1 style="color: #6366f1; margin: 0;">CreatoKite</h1>
          </div>
          <div style="padding: 20px 0;">
            <p>Hello,</p>
            <p>We detected a new login to your CreatoKite account for <strong>${email}</strong>.</p>
            <p>If this was you, no action is needed. If you did not authorize this login, please contact support or reset your password immediately.</p>
            <p style="margin-top: 30px;">Best regards,<br/>The CreatoKite Team</p>
          </div>
          <div style="text-align: center; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #888;">
            &copy; 2026 CreatoKite. All rights reserved.
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Login Email sent successfully:", info.messageId);
  } catch(error) {
    console.log("❌ Login Email error:", error);
  }
};

const sendWelcomeMail = async (email, displayName) => {
  if (!process.env.EMAIL_PASS) {
    console.log("⚠️ EMAIL_PASS not set in env. Skipping welcome email.");
    return;
  }
  try {
    const mailOptions = {
      from: `"CreatoKite" <${process.env.EMAIL_USER || "creatokite123@gmail.com"}>`,
      to: email,
      subject: "Welcome to CreatoKite! 🚀",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px;">
            <h1 style="color: #6366f1; margin: 0;">Welcome to CreatoKite!</h1>
          </div>
          <div style="padding: 20px 0;">
            <p>Hi ${displayName || "there"},</p>
            <p>Welcome to <strong>CreatoKite</strong> — the AI-Powered Creator Campaign Operating System!</p>
            <p>Your account is successfully created and verified. You can now start collaborating, tracking campaigns, and optimizing your creator workflows.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/login" style="background: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Get Started</a>
            </div>
            <p>If you have any questions, feel free to reply to this email.</p>
            <p style="margin-top: 30px;">Best regards,<br/>The CreatoKite Team</p>
          </div>
          <div style="text-align: center; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #888;">
            &copy; 2026 CreatoKite. All rights reserved.
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Welcome Email sent successfully:", info.messageId);
  } catch(error) {
    console.log("❌ Welcome Email error:", error);
  }
};

const sendVerificationMail = async (email, token) => {
  if (!process.env.EMAIL_PASS) {
    console.log("⚠️ EMAIL_PASS not set in env. Skipping verification email.");
    return;
  }
  try {
    const link = `${process.env.CLIENT_URL || "http://localhost:5173"}/verify-email?token=${token}`;
    const mailOptions = {
      from: `"CreatoKite" <${process.env.EMAIL_USER || "creatokite123@gmail.com"}>`,
      to: email,
      subject: "Verify your email - CreatoKite",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px;">
            <h1 style="color: #6366f1; margin: 0;">Verify Email</h1>
          </div>
          <div style="padding: 20px 0;">
            <p>Welcome to CreatoKite!</p>
            <p>Please click the link below to verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" style="background: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Verify Email</a>
            </div>
            <p>Or copy this link: <a href="${link}">${link}</a></p>
          </div>
        </div>
      `
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Verification Email sent:", info.messageId);
  } catch(error) {
    console.log("❌ Verify email error:", error);
  }
};

module.exports = { sendLoginMail, sendWelcomeMail, sendVerificationMail };