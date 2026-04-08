const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const protect = require("../middleware/authMiddleware");

// 1. POST — Submit a review (public)
router.post("/", async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 2. GET ALL — Fetch all reviews (public)
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. PUT — Update a review (admin only)
router.put("/:id", protect, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      return res.status(404).json({ success: false, error: "Review not found" });
    }

    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 4. DELETE — Delete a review (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, error: "Review not found" });
    }

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
