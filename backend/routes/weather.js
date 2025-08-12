import express from "express"; // Web framework
import axios from "axios"; // HTTP client
import dotenv from "dotenv"; // For loading environment variables
import rateLimit from "express-rate-limit"; // Rate limiting middleware

dotenv.config();

const router = express.Router();
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Rate limiter: max 10 requests per 15 minutes per IP
const externalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { msg: "Too many requests. Please try again later." },
});

// GET /:city - Fetch current weather for the specified city
router.get("/:city", externalApiLimiter, async (req, res) => {
  const city = req.params.city;

  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          units: "metric",
          appid: OPENWEATHER_API_KEY,
        },
      }
    );

    // Respond with simplified weather data
    res.json({
      city: response.data.name,
      weather: response.data.weather[0].main,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
    });
  } catch (err) {
    res.status(500).json({ msg: "Weather fetch failed", error: err.message });
  }
});

export default router;
