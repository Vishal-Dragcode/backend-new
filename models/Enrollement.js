const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    age: { type: Number, required: true },
    contactNo: { type: String, required: true },
    email: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String },
    emergencyContact: {
      name: { type: String, required: true },
      contactNo: { type: String, required: true },
    },
    qualification: { type: String, required: true },
    occupation: { type: String, required: true },
    experience: { type: String, required: true },
    courseEnrolled: { type: String, required: true },
    modeOfClass: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      required: true,
    },
    batchTiming: { type: String, required: true },
    declaration: { type: Boolean, required: true },
    status: { type: String, default: "pending" },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  },
  { timestamps: true }
);

enrollmentSchema.index({ createdAt: -1 });
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ courseEnrolled: 1 });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
