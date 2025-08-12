import mongoose from "mongoose"; // MongoDB object modeling

// Schema for storing travel itineraries
const ItinerarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Linked user
  city: { type: String, required: true }, // Destination city
  startTime: { type: String, required: true }, // Itinerary start time
  endTime: { type: String, required: true }, // Itinerary end time
  budget: { type: String }, // Optional budget info
  interests: [{ type: String }], // List of user interests
  places: [
    {
      name: String, // Place name
      address: String, // Place address
      rating: Number, // Rating score
      userRatingsTotal: Number, // Number of ratings
      startTime: { type: String }, // Planned visit start
      endTime: { type: String }, // Planned visit end
      location: {
        lat: Number, // Latitude
        lng: Number, // Longitude
      },
      openNow: Boolean, // Current open status
      photo: String, // Photo URL
    },
  ],
  date: { type: Date, default: Date.now }, // Creation date
});

// Export Itinerary model
export default mongoose.model("Itinerary", ItinerarySchema);
