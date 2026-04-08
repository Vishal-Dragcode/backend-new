const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ rating: 1 });

module.exports = mongoose.model("Review", reviewSchema);
