const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const RegistrationToEvent = require("../models/RegistrationToEvent");
const protect = require("../middleware/authMiddleware");

// 1. POST — Create new event (admin only)
router.post("/", protect, async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 2. GET ALL — Fetch all events with registration counts (public)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).lean();

    const eventsWithCounts = await Promise.all(
      events.map(async (e) => {
        const count = await RegistrationToEvent.countDocuments({ eventId: e._id });
        return { ...e, booked: count };
      })
    );

    res.status(200).json({ success: true, data: eventsWithCounts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. GET SINGLE — Fetch one event (public)
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. PUT — Update event (admin only)
router.put("/:id", protect, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 5. DELETE — Remove event (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. GET REGISTRATIONS — Fetch registrations for a specific event (admin only)
router.get("/:id/registrations", protect, async (req, res) => {
  try {
    const registrations = await RegistrationToEvent.find({
      eventId: req.params.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: registrations,
      count: registrations.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. POST REGISTER — Register for an event (public)
router.post("/:id/register", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    const booked = await RegistrationToEvent.countDocuments({ eventId: req.params.id });
    if (event.slots > 0 && booked >= event.slots) {
      return res.status(400).json({ success: false, error: "This event is fully booked." });
    }

    const registration = await RegistrationToEvent.create({
      fullName: req.body.fullName,
      contactNo: req.body.contactNo,
      email: req.body.email,
      eventId: event._id,
      eventTitle: event.title,
      status: "pending",
    });

    res.status(201).json({ success: true, data: registration, eventTitle: event.title });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
