const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const sendEmail = require("../utils/sendEmail");

// POST — Send OTP
// Mail is SYNC here — admin must receive OTP before proceeding, so we wait
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.otp = otp;
    await admin.save();

    // SYNC — wait for email because admin needs OTP to login
    await sendEmail({
      email: admin.email,
      subject: "Admin Verification OTP",
      message: `Your OTP is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0c111d; color: #ffffff; padding: 40px; text-align: center; border-radius: 20px; border: 1px solid #1e293b;">
          <h1 style="color: #3b82f6; font-size: 24px; font-weight: 800; letter-spacing: 4px; text-transform: uppercase;">ADMIN VERIFICATION</h1>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 30px;">Your secure access key for the Trader Nation terminal.</p>
          <div style="background-color: #1e293b; padding: 25px; border-radius: 16px; border: 1px solid #3b82f6; display: inline-block; margin-bottom: 30px;">
            <span style="font-size: 36px; font-weight: 900; color: #ffffff; letter-spacing: 12px; font-family: 'Courier New', monospace;">${otp}</span>
          </div>
          <p style="color: #475569; font-size: 11px;">OTP expires in 5 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: "OTP sent to admin email" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ success: false, error: "Could not send OTP. Please try again." });
  }
});

// POST — Verify OTP + return JWT token
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: "Email and OTP are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }

    if (String(admin.otp) !== String(otp)) {
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }

    // Clear OTP after verification
    admin.otp = null;
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
