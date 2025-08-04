import express from "express";
import auth from "../middleware/auth.js";
import Itinerary from "../models/Itinerary.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { city, startTime, endTime, budget, interests, places } = req.body;
  if (!city || !startTime || !endTime || !places || !places.length) {
    return res.status(400).json({ msg: "Missing required fields" });
    }
    try {
      const itinerary = await Itinerary.create({
        user: req.user,
        city,
        startTime,
        endTime,
        budget,
        interests,
        places,
        date: new Date(),
      });
      res.status(201).json(itinerary);
    } catch (err) {
    console.error("Itinerary save error:", err.message, err.stack);
    res.status(500).json({ msg: "Server error", error: err.message });
    }
});

router.get("/", auth, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user }).sort({ date: -1 });
    res.json(itineraries);
  } catch (err) {
    res.status(500).json({ msg: "Server error fetching itineraries" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (!itinerary) return res.status(404).json({ msg: "Itinerary not found" });
    res.json({ msg: "Itinerary deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error deleting itinerary" });
  }
});


export default router;
