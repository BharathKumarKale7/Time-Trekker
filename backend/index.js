import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth.js';
import weatherRoutes from './routes/weather.js';
import placesRoutes from './routes/places.js';
import itineraryRoutes from './routes/itinerary.js';

app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/itinerary", itineraryRoutes);


// MongoDB connection
const PORT = process.env.PORT || 5000;

// Example route
app.get("/", (req, res) => res.send("API is running"));

// Connect MongoDB & Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.error(err));
