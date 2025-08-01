import express from "express";
import axios from "axios";
import rateLimit from "express-rate-limit";
const router = express.Router();


const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const externalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max requests per IP
  message: { msg: "Too many requests. Please try again later." },
});

router.get("/:city", externalApiLimiter, async (req, res) => {
  const city = req.params.city;
  const keyword = req.query.keyword || "tourist attractions";

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json`,
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

export default router;