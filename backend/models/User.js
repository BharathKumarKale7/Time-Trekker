import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  gender: { type: String },
  dob: { type: Date },
  bio: { type: String },
  profileImage: { type: String, default: "" },
  coverImage: {type: String, default:""}
});


export default mongoose.model("User", UserSchema);
