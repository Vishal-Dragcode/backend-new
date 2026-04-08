const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

contactSchema.index({ createdAt: -1 });
contactSchema.index({ isRead: 1 });

module.exports = mongoose.model("ContactUs", contactSchema);
