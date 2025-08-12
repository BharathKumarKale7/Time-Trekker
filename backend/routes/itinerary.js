import express from "express"; // Web framework
import auth from "../middleware/authMiddleware.js"; // JWT authentication middleware
import Itinerary from "../models/itineraryModel.js"; // Itinerary model
import { validateItinerary } from "../validators/itineraryValidator.js"; // Itinerary validation rules
import { validationResult } from "express-validator"; // For validating request data

const router = express.Router();

// Create new itinerary
router.post("/", auth, validateItinerary, async (req, res, next) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 400;
    error.details = errors.array();
    return next(error);
  }

  const { city, startTime, endTime, budget, interests, places } = req.body;

  try {
    // Save itinerary to database
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

// Get all itineraries for authenticated user
router.get("/", auth, async (req, res, next) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user }).sort({ date: -1 });
    res.json(itineraries);
  } catch (err) {
    next(err);
  }
});

// Delete itinerary by ID
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

export default router; // Export router
