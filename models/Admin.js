const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true, unique: true },
    otp: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
