import mongoose from "mongoose"; // Import Mongoose library for MongoDB connection

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB using URI from environment variables
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    // Log connection error and exit process
    console.error("Mongo error", err);
    process.exit(1);
  }
};

export default connectDB; // Export the connection function
