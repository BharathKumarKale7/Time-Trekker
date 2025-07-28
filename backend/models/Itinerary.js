// models/Itinerary.js
import mongoose from "mongoose";

const ItinerarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  city: String,
  startTime: Date,
  endTime: Date,
  budget: Number,
  interests: [String],
  places: [{ name: String, duration: Number, location: String }],
});

export default mongoose.model("Itinerary", ItinerarySchema);