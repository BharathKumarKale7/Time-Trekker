import express from "express"; // Web framework
import authMiddleware from "../middleware/authMiddleware.js"; // JWT authentication middleware
import { signup, login } from "../controllers/authController.js"; // Auth controllers
import { getProfile, updateProfile, uploadUserImages } from "../controllers/profileController.js"; // Profile controllers
import { validateSignup } from "../validators/authValidator.js"; // Signup validation rules
import upload from "../middleware/upload.js"; // File upload middleware
import { forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

// AUTH ROUTES
router.post("/signup", validateSignup, signup); // Register a new user
router.post("/login", login); // Login existing user
router.post("/forgot-password", forgotPassword); // Send reset email
router.post("/reset-password/:token", resetPassword); // Reset password using token

// PROFILE ROUTES
router.get("/me", authMiddleware, getProfile); // Get authenticated user's profile
router.put("/me", authMiddleware, updateProfile); // Update profile info
router.post(
  "/upload-images",
  authMiddleware,
  upload.fields([
    { name: "profileImage", maxCount: 1 }, // Profile picture upload
    { name: "coverImage", maxCount: 1 } // Cover picture upload
  ]),
  uploadUserImages
);

export default router; // Export router for app use
