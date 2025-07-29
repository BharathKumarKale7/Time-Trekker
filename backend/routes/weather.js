// backend/routes/weather.js
import express from "express";
import axios from "axios";
const router = express.Router();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

router.get("/:city", async (req, res) => {
  const city = req.params.city;

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
