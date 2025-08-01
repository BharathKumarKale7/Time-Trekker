import express from "express";
import axios from "axios";
import rateLimit from "express-rate-limit";

const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const externalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { msg: "Too many requests. Please try again later." },
});

// ✅ 1. City-based place search
router.get("/:city", externalApiLimiter, async (req, res) => {
  const city = req.params.city;
  const keyword = req.query.keyword || "tourist attractions";

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: `${keyword} in ${city}`,
          key: GOOGLE_API_KEY,
        },
      }
    );

    const places = response.data.results.map((place) => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      location: place.geometry.location,
      openNow: place.opening_hours?.open_now ?? null,
      photo: place.photos?.[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
        : null,
    }));

    res.json({ city, results: places });
  } catch (err) {
    res.status(500).json({ msg: "Places fetch failed", error: err.message });
  }
});

// ✅ 2. Location & time-based nearby recommendation
router.get("/recommend", externalApiLimiter, async (req, res) => {
  const { lat, lng, hours } = req.query;

  if (!lat || !lng || !hours) {
    return res.status(400).json({ msg: "Latitude, longitude, and hours are required." });
  }

  try {
    const nearbyRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lng}`,
          radius: 8000,
          type: "tourist_attraction",
          key: GOOGLE_API_KEY,
        },
      }
    );

    const places = nearbyRes.data.results.slice(0, 20);

    const destinations = places
      .map((p) => `${p.geometry.location.lat},${p.geometry.location.lng}`)
      .join("|");

    const distanceRes = await axios.get(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
      {
        params: {
          origins: `${lat},${lng}`,
          destinations,
          key: GOOGLE_API_KEY,
        },
      }
    );

    const durations = distanceRes.data.rows[0].elements;
    const maxTimeMinutes = Number(hours) * 60;

    const recommended = places.filter((place, i) => {
      const travel = durations[i].duration?.value || 0; // in seconds
      const visit = 45 * 60; // default 45 min per attraction
      return (travel + visit) / 60 <= maxTimeMinutes;
    });

    const results = recommended.map((place, i) => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      location: place.geometry.location,
      openNow: place.opening_hours?.open_now ?? null,
      travelTime: durations[i]?.duration?.text || "N/A",
      photo: place.photos?.[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
        : null,
    }));

    res.json({ results });
  } catch (err) {
    res.status(500).json({ msg: "Nearby places fetch failed", error: err.message });
  }
});

export default router;