import express from "express";
import authMiddleware from "../middleware/auth.js";
import { signup, login } from "../controllers/authController.js";
import { getProfile, updateProfile, uploadUserImages} from "../controllers/profileController.js";
import { validateSignup } from "../validators/authValidator.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ===== AUTH ROUTES =====
router.post("/signup", validateSignup, signup);
router.post("/login", login);

// ===== PROFILE ROUTES =====
router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);
router.post(
  "/upload-images",
  authMiddleware,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  uploadUserImages
);


export default router;
