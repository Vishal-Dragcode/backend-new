const express = require("express");
const router = express.Router();
const ContactUs = require("../models/ContactUs");
const protect = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");

// 1. POST — Submit contact form (public)
// Save to DB → respond instantly → send email in background
router.post("/", async (req, res) => {
  try {
    const contact = await ContactUs.create(req.body);

    // Respond immediately — don't make user wait for email
    res.status(201).json({ success: true, data: contact });

    // Send admin notification email in background (non-blocking)
    sendEmail({
      email: process.env.EMAIL_USER,
      subject: `[INQUIRY] ${contact.name}`,
      message: `${contact.name} has sent a message: ${contact.message}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #0a0f1c; color: #fff; padding: 40px; border-radius: 20px;">
          <h1 style="font-size: 24px; font-weight: 800;">New Student Inquiry</h1>
          <div style="margin: 20px 0; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px;">
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Mobile:</strong> ${contact.mobile}</p>
            <p><strong>Message:</strong> ${contact.message}</p>
          </div>
        </div>
      `,
    }).catch((err) => console.error("Contact email failed:", err.message));

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 2. GET ALL — Fetch all messages (admin only)
router.get("/", protect, async (req, res) => {
  try {
    const messages = await ContactUs.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. PATCH — Toggle isRead (admin only)
router.patch("/:id/isread", protect, async (req, res) => {
  try {
    const message = await ContactUs.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, error: "Message not found" });
    }

    message.isRead = !message.isRead;
    await message.save();

    res.status(200).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. DELETE — Delete a message (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const message = await ContactUs.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, error: "Message not found" });
    }

    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
