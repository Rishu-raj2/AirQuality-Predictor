const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

/**
 * GET /api/airquality?city=<cityName>
 * Server-side proxy for the RapidAPI Air Quality endpoint.
 * The API key never reaches the browser.
 */
router.get("/airquality", async (req, res) => {
  const city = req.query.city?.trim();

  if (!city) {
    return res.status(400).json({ error: "City name is required." });
  }

  const url = `https://air-quality-by-api-ninjas.p.rapidapi.com/v1/airquality?city=${encodeURIComponent(city)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "air-quality-by-api-ninjas.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch air quality data." });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("Air quality API error:", err.message);
    return res.status(500).json({ error: "Internal server error while fetching air quality data." });
  }
});

/**
 * POST /api/assistance
 * Sends a user message to the Gemini AI model and returns the response.
 */
router.post("/assistance", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage(message.trim());
    const text = await result.response.text();
    return res.json({ text });
  } catch (err) {
    console.error("Gemini AI error:", err.message);
    return res.status(500).json({ error: "AI assistant is currently unavailable. Please try again later." });
  }
});

module.exports = router;
