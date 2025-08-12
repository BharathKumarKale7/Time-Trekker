import mongoose from "mongoose"; // MongoDB object modeling

// Schema for storing user account information
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User's full name
  email: { type: String, required: true, unique: true }, // Unique email address
  password: { type: String, required: true }, // Hashed password
  phone: { type: String }, // Optional phone number
  location: { type: String }, // Optional location
  gender: { type: String }, // Optional gender
  dob: { type: Date }, // Optional date of birth
  bio: { type: String }, // Optional biography
  profileImage: { type: String, default: "" }, // Profile picture URL
  coverImage: { type: String, default: "" }, // Cover picture URL
  resetOTP: { type: String }, // hashed OTP
  resetOTPExpire: { type: Date }, // OTP expiry time
  resetOTPAttempts: { type: Number, default: 0 }, // failed attempts using OTP
  resetOTPLockedUntil: { type: Date }  // lockout time after too many failed attempts
},
{
  timestamps: true
});

// Export User model
export default mongoose.model("User", UserSchema);
