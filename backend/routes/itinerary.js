import express from "express";
import auth from "../middleware/auth.js";
import Itinerary from "../models/Itinerary.js";
import { validateItinerary } from "../validators/itineraryValidator.js";
import { validationResult } from "express-validator";

const router = express.Router();

router.post("/", auth, validateItinerary, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 400;
    error.details = errors.array();
    return next(error);
  }

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
      date: new Date(),
    });
    res.status(201).json(itinerary);
  } catch (err) {
    next(err);
  }
});

router.get("/", auth, async (req, res, next) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user }).sort({ date: -1 });
    res.json(itineraries);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (!itinerary) {
      const error = new Error("Itinerary not found");
      error.statusCode = 404;
      return next(error);
    }
    res.json({ msg: "Itinerary deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
