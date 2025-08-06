import express from "express";
import axios from "axios";
const router = express.Router();

router.get("/events", async (req, res) => {
  const { city, lat, lng } = req.query;
  const token = process.env.EVENTBRITE_TOKEN;
  if (!token) return res.status(500).json({ msg: "Missing Eventbrite token" });

  const params = { token, expand: "venue" };
  if (lat && lng) {
    params["location.latitude"] = lat;
    params["location.longitude"] = lng;
    params["location.within"] = "20km";
  } else if (city) {
    params["location.address"] = city;
  } else {
    return res.status(400).json({ msg: "Provide city or coordinates" });
  }

  try {
    const resp = await axios.get("https://www.eventbriteapi.com/v3/events/search/", { params });
    const events = resp.data.events.map(e => ({
      id: e.id,
      name: e.name.text,
      city: e.venue?.address?.city || "",
      date: e.start?.local,
      image: e.logo?.url,
      url: e.url,
      description: e.description?.text?.substring(0, 200) || ""
    }));
    res.json(events);
  } catch (err) {
    console.error("Eventbrite request failed", err.response?.data || err.message);
    res.status(500).json({ msg: "Failed fetching events" });
  }
});

export default router;
