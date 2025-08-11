import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import cors from "cors";
import connectDB from "./config/db.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from "./routes/auth.js";
import weatherRoutes from "./routes/weather.js";
import placesRoutes from "./routes/places.js";
import itineraryRoutes from "./routes/itinerary.js";
import eventsRoutes from "./routes/events.js";

app.use("/api/events", eventsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
