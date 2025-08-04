import mongoose from "mongoose";

const ItinerarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  city: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  budget: { type: String },
  interests: [{ type: String }],
  places: [
    {
      name: String,
      address: String,
      rating: Number,
      userRatingsTotal: Number,
      startTime: { type: String },
      endTime: { type: String },
      location: {
        lat: Number,
        lng: Number,
      },
      openNow: Boolean,
      photo: String,
    },
  ],
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Itinerary", ItinerarySchema);