import express from "express";
import auth from "../middleware/auth.js";
import Itinerary from "../models/Itinerary.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { city, startTime, endTime, budget, interests, places } = req.body;
  try {
    const itinerary = await Itinerary.create({
      user: req.user,
      city,
      startTime,
      endTime,
      budget,
      interests,
      places,
      date,
    });
    res.status(201).json(itinerary);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
  const itineraries = await Itinerary.find({ user: req.user });
  res.json(itineraries);
});


export default router;
