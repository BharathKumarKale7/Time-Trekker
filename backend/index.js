import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// Routes
import authRoutes from "./routes/auth.js";
import weatherRoutes from "./routes/weather.js";
import placesRoutes from "./routes/places.js";
import itineraryRoutes from "./routes/itinerary.js";
import eventsRouter from "./routes/events.js";

app.use("/api/events", eventsRouter);
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/itinerary", itineraryRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
