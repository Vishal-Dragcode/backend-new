const mongoose = require("mongoose");

const registrationToEventSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: [true, "Full name is required"] },
    contactNo: { type: String, required: [true, "Contact number is required"] },
    email: { type: String, required: [true, "Email is required"] },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    eventTitle: { type: String },
    status: { type: String, default: "pending" },
  },
  { timestamps: true, collection: "registration_to_event" }
);

registrationToEventSchema.index({ eventId: 1 });
registrationToEventSchema.index({ createdAt: -1 });
registrationToEventSchema.index({ status: 1 });

module.exports = mongoose.model("RegistrationToEvent", registrationToEventSchema);
