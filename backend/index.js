import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import cors from "cors";
import connectDB from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
import authRoutes from "./routes/auth.js";
import weatherRoutes from "./routes/weather.js";
import placesRoutes from "./routes/places.js";
import itineraryRoutes from "./routes/itinerary.js";
import eventsRoutes from "./routes/events.js";

// Route middleware
app.use("/api/events", eventsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/itinerary", itineraryRoutes);

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
