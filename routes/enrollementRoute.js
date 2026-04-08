const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollement");
const protect = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");

// 1. POST — Add new enrollment (public)
// Save to DB → respond instantly → send email in background
router.post("/", async (req, res) => {
  try {
    const enrollment = await Enrollment.create(req.body);

    // Respond immediately — don't make user wait for email
    res.status(201).json({ success: true, data: enrollment });

    // Send admin notification email in background (non-blocking)
    sendEmail({
      email: process.env.EMAIL_USER,
      subject: `[NEW ENROLLMENT] ${enrollment.fullName}`,
      message: `${enrollment.fullName} has submitted an enrollment form for ${enrollment.courseEnrolled}.`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #0a0f1c; color: #fff; padding: 40px; border-radius: 20px;">
          <h1 style="font-size: 24px; font-weight: 800;">New Student Enrollment</h1>
          <div style="margin: 20px 0; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px;">
            <p><strong>Name:</strong> ${enrollment.fullName}</p>
            <p><strong>Course:</strong> ${enrollment.courseEnrolled}</p>
            <p><strong>Mode:</strong> ${enrollment.modeOfClass}</p>
            <p><strong>Contact:</strong> ${enrollment.contactNo}</p>
          </div>
        </div>
      `,
    }).catch((err) => console.error("Enrollment email failed:", err.message));

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 2. GET ALL — Fetch all enrollments (admin only)
router.get("/", protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: enrollments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. GET BY ID — Fetch single enrollment (admin only)
router.get("/:id", protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ success: false, error: "Enrollment not found" });
    }

    res.status(200).json({ success: true, data: enrollment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. PUT — Update enrollment (admin only)
router.put("/:id", protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!enrollment) {
      return res.status(404).json({ success: false, error: "Enrollment not found" });
    }

    res.status(200).json({ success: true, data: enrollment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 5. DELETE — Delete enrollment (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ success: false, error: "Enrollment not found" });
    }

    res.status(200).json({ success: true, message: "Enrollment deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
