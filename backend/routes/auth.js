import express from "express"; // Web framework
import authMiddleware from "../middleware/authMiddleware.js"; // JWT authentication middleware
import { signup, login } from "../controllers/authController.js"; // Auth controllers
import { getProfile, updateProfile, uploadUserImages } from "../controllers/profileController.js"; // Profile controllers
import { validateSignup } from "../validators/authValidator.js"; // Signup validation rules
import upload from "../middleware/upload.js"; // File upload middleware
import { requestPasswordOTP, resetPasswordWithOTP } from "../controllers/authController.js"; // Password reset controllers
import rateLimit from "express-rate-limit";

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const otpRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // limit number of OTP requests per IP per hour
  message: { msg: "Too many OTP requests from this IP, please try later." }
});

const router = express.Router();

// AUTH ROUTES
router.post("/signup", validateSignup, signup); // Register a new user
router.post("/login", login); // Login existing user
router.post("/request-password-otp", requestPasswordOTP);
router.post("/reset-password-otp", otpRequestLimiter, resetPasswordWithOTP);

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
