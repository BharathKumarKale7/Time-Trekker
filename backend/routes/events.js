import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const TM_API_KEY = process.env.TICKETMASTER_API_KEY;

router.get("/", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ msg: "City is required" });
  }

  try {
    const response = await axios.get("https://app.ticketmaster.com/discovery/v2/events.json", {
      params: {
        apikey: TM_API_KEY,
        city,
        size: 20,
        sort: "date,asc",
      },
    });

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
    console.error("Ticketmaster API error:", err.response?.data || err.message);
    res.status(500).json({ msg: "Failed to fetch events" });
  }
});

export default router;
