import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  signup,
  login,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import { validateSignup } from "../validators/authValidator.js";

const router = express.Router();

// Signup
router.post("/signup", validateSignup, signup);

// Login
router.post("/login", login);

// Get profile
router.get("/me", authMiddleware, getProfile);

// Update profile
router.put("/me", authMiddleware, updateProfile);

// Test secure route
router.get("/secure-data", authMiddleware, (req, res) => {
  res.json({ msg: "You accessed protected data!", userId: req.user });
});

export default router;
