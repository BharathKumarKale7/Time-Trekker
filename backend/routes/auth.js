import express from "express";
import { body } from "express-validator";
import authMiddleware from "../middleware/auth.js";
import {
  signup,
  login,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";

const router = express.Router();

// Signup
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/)
      .withMessage("Must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Must contain at least one lowercase letter")
      .matches(/\d/)
      .withMessage("Must contain at least one number")
      .matches(/[!@#$%^&*]/)
      .withMessage("Must contain at least one special character"),
  ],
  signup
);

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
