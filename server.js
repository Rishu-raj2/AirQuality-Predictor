const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config();

// Import Routes
const apiRoutes = require("./routes/api");
const pageRoutes = require("./routes/pages");

const app = express();
const PORT = process.env.PORT || 3000;

// Validate required environment variables on startup
if (!process.env.API_KEY || process.env.API_KEY === "your_gemini_api_key_here") {
  console.warn("⚠️ Warning: API_KEY is missing or invalid. AI assistant will not work.");
}
if (!process.env.RAPIDAPI_KEY || process.env.RAPIDAPI_KEY === "your_rapidapi_key_here") {
  console.warn("⚠️ Warning: RAPIDAPI_KEY is missing or invalid. Air quality data will not work.");
}

// Middleware
app.use(bodyParser.json());

// Serve all static frontend files from the public/ directory
app.use(express.static(path.join(__dirname, "public")));

// ─────────────────────────────────────────────
// REGISTER ROUTES
// ─────────────────────────────────────────────

// Page Routes (/, /prediction, /about)
app.use("/", pageRoutes);

// API Routes (/api/airquality, /api/assistance)
app.use("/api", apiRoutes);

// Keep legacy /assistance route for compatibility with existing frontend code
app.use("/assistance", async (req, res) => {
  // redirecting POST is tricky, so we'll just handle it by forwarding to the new router logic
  // or simply update the frontend. I updated bot.js to point to /assistance so let's keep it working.
  // We'll require the router logic here just for this legacy route:
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");
  const { message } = req.body;
  if (!message || message.trim() === "") return res.status(400).json({ error: "Message cannot be empty." });
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage(message.trim());
    const text = await result.response.text();
    return res.json({ text });
  } catch (err) {
    console.error("Gemini AI error:", err.message);
    return res.status(500).json({ error: "AI assistant is currently unavailable." });
  }
});


// 404 fallback - Serve index page for SPA routing or just display a 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "index.html"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ error: "Something broke on the server!" });
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────

const server = app.listen(PORT, () => {
  console.log("\n========================================================");
  console.log(`🚀 AirInsight server successfully running on port ${PORT}`);
  console.log(`🌍 Access the app at: http://localhost:${PORT}`);
  console.log("========================================================\n");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ ERROR: Port ${PORT} is already in use.`);
    console.error(`Please kill the process using port ${PORT} and try again.\n`);
    process.exit(1);
  } else {
    console.error("\n❌ ERROR starting server:", err);
  }
});
