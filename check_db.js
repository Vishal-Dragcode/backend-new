const mongoose = require("mongoose");
require("dotenv").config();

const Enrollment = require("./models/Enrollement");
const Review = require("./models/Review");
const ContactUs = require("./models/ContactUs");

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const regCount = await Enrollment.countDocuments();
    const revCount = await Review.countDocuments();
    const conCount = await ContactUs.countDocuments();

    console.log(`Registrations: ${regCount}`);
    console.log(`Reviews: ${revCount}`);
    console.log(`Contacts: ${conCount}`);

    if (regCount > 0) {
        const lastReg = await Enrollment.findOne().sort({ createdAt: -1 });
        console.log(`Last Registration CreatedAt: ${lastReg.createdAt}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
