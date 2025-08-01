import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validationResult } from "express-validator";

// Signup Controller
export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ msg: "User created" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user).select("-password");
  res.json(user);
};

// Update Profile
export const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(
      req.user,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Error updating profile" });
  }
};
