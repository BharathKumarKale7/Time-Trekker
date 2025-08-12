import express from "express"; // Web framework
import axios from "axios"; // For making HTTP requests
import dotenv from "dotenv"; // For loading environment variables

dotenv.config();
const router = express.Router();

const TM_API_KEY = process.env.TICKETMASTER_API_KEY; // Ticketmaster API key

// GET events by city
router.get("/", async (req, res) => {
  const { city } = req.query;

  // Require city query parameter
  if (!city) {
    return res.status(400).json({ msg: "City is required" });
  }

  try {
    // Request events from Ticketmaster API
    const response = await axios.get("https://app.ticketmaster.com/discovery/v2/events.json", {
      params: {
        apikey: TM_API_KEY,
        city,
        size: 20,
        sort: "date,asc",
      },
    });

    // Format API response
    const events = response.data._embedded?.events?.map((e) => ({
      id: e.id,
      name: e.name,
      url: e.url,
      date: e.dates?.start?.localDate,
      time: e.dates?.start?.localTime,
      venue: e._embedded?.venues?.[0]?.name || "",
      city: e._embedded?.venues?.[0]?.city?.name || "",
      image: e.images?.[0]?.url || "",
    })) || [];

    res.json(events);
  } catch (err) {
    // Log and return error
    console.error("Ticketmaster API error:", err.response?.data || err.message);
    res.status(500).json({ msg: "Failed to fetch events" });
  }
});

export default router; // Export router
