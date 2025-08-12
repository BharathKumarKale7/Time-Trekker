import mongoose from "mongoose"; // MongoDB object modeling

// Schema for storing user account information
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User's full name
  email: { type: String, required: true, unique: true }, // Unique email address
  password: { type: String, required: true }, // Hashed password
  resetPasswordToken: { type: String },// Token for password reset
  resetPasswordExpire: { type: Date }, // Expiry time for reset token
  phone: { type: String }, // Optional phone number
  location: { type: String }, // Optional location
  gender: { type: String }, // Optional gender
  dob: { type: Date }, // Optional date of birth
  bio: { type: String }, // Optional biography
  profileImage: { type: String, default: "" }, // Profile picture URL
  coverImage: { type: String, default: "" } // Cover picture URL
});

// Export User model
export default mongoose.model("User", UserSchema);
