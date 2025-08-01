import express from "express";
import axios from "axios";
const router = express.Router();
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
dotenv.config();


const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const externalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max requests per IP
  message: { msg: "Too many requests. Please try again later." },
});

router.get("/:city", externalApiLimiter, async (req, res) => {
  const city = req.params.city;

  console.log("Using OpenWeather API Key:", OPENWEATHER_API_KEY); // delete after debug

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          units: "metric",
          appid: OPENWEATHER_API_KEY,
        },
      }
    );

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
