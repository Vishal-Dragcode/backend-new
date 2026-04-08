const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const https = require("https");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    message: "Trader Nation Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    db_status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Fake ping route — keeps Render alive, does nothing else
app.get("/api/ping", (req, res) => {
  res.status(200).json({ success: true, message: "pong" });
});

// Routes
app.use("/api/reviews", require("./routes/reviewRoute"));
app.use("/api/contact", require("./routes/contactRoute"));
app.use("/api/enroll", require("./routes/enrollementRoute"));
app.use("/api/events", require("./routes/eventRoute"));
app.use("/api/admin", require("./routes/adminRoute"));

// Keep Render alive — hits /api/ping every 10 minutes
const keepAlive = () => {
  const url = process.env.RENDER_URL;
  if (!url) return;

  setInterval(() => {
    https
      .get(`${url}/api/ping`, (res) => {
        console.log(`🏓 Keep-alive ping — status: ${res.statusCode}`);
      })
      .on("error", (err) => {
        console.error("Keep-alive failed:", err.message);
      });
  }, 10 * 60 * 1000);
};

// Connect DB first, then start server
mongoose
  .connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      keepAlive();
    });
  })
  .catch((err) => {
    console.error(`❌ Connection Error: ${err.message}`);
    process.exit(1);
  });
