import express from "express"; // Web framework
import axios from "axios"; // HTTP client
import rateLimit from "express-rate-limit"; // Rate limiting middleware

const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Rate limiter for external API calls (max 10 requests per 15 minutes)
const externalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { msg: "Too many requests. Please try again later." },
});

// 1. City-based place search using Google Places Text Search API
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

    // Format and return places
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

// 2. Location & time-based nearby tourist attraction recommendations
router.get("/recommend", externalApiLimiter, async (req, res) => {
  const { lat, lng, hours } = req.query;

  if (!lat || !lng || !hours) {
    return res.status(400).json({ msg: "Latitude, longitude, and hours are required." });
  }

  try {
    // Fetch nearby tourist attractions within 8 km radius
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

    // Prepare destinations string for Distance Matrix API
    const destinations = places
      .map((p) => `${p.geometry.location.lat},${p.geometry.location.lng}`)
      .join("|");

    // Get travel durations from current location to each place
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
    const visitDurationSec = 45 * 60; // 45 minutes per attraction

    // Filter places based on total travel + visit time within user available time
    const recommended = places.filter((place, i) => {
      const travelSec = durations[i].duration?.value || 0;
      return (travelSec + visitDurationSec) / 60 <= maxTimeMinutes;
    });

    // Format recommended places with travel time info
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
