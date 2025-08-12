import bcrypt from "bcryptjs"; // For password hashing
import jwt from "jsonwebtoken"; // For generating authentication tokens
import User from "../models/userModel.js"; // User model
import { validationResult } from "express-validator"; // For request validation
import crypto from "crypto"; // For generating secure random values
import sendEmail from "../utils/sendEmail.js"; // Utility to send emails

// Signup Controller
export const signup = async (req, res, next) => {
  // Validate request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 400;
    error.details = errors.array();
    return next(error);
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      return next(error);
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send response with token
    res.status(201).json({ msg: "User created", token });
  } catch (err) {
    next(err); // Pass errors to error handler
  }
};

// Login Controller
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      return next(error);
    }

    // Compare provided password with stored hash
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      return next(error);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send token and user info
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err); // Pass errors to error handler
  }
};

// Forgot Password Controller
const OTP_LENGTH = 6;
const OTP_EXPIRE_MS = 10 * 60 * 1000; // 10 minutes
const MAX_OTP_ATTEMPTS = 5;            // after this, lock for LOCK_DURATION_MS
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

// Helper: generate 6-digit OTP as string
const generateOTP = (len = OTP_LENGTH) => {
  const min = Math.pow(10, len - 1);
  const num = Math.floor(min + Math.random() * 9 * min);
  return String(num);
};

// 1) Request OTP endpoint
export const requestPasswordOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Do not reveal whether email exists — respond success to avoid enumeration
      return res.json({ msg: "If an account exists for that email, an OTP has been sent." });
    }

    // throttle per email: require min interval between OTPs (e.g., 2 minutes)
    const MIN_OTP_INTERVAL_MS = 2 * 60 * 1000;
    if (user.resetOTPExpire && (user.resetOTPExpire - OTP_EXPIRE_MS + MIN_OTP_INTERVAL_MS) > Date.now()) {
      return res.status(429).json({ msg: "OTP already sent recently. Please wait and try again." });
    }

    // If user currently locked from previous failed attempts
    if (user.resetOTPLockedUntil && user.resetOTPLockedUntil > Date.now()) {
      return res.status(429).json({ msg: "Too many attempts. Try again later." });
    }

    const otp = generateOTP();
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetOTP = hashedOTP;
    user.resetOTPExpire = Date.now() + OTP_EXPIRE_MS;
    user.resetOTPAttempts = 0;
    user.resetOTPLockedUntil = undefined;

    await user.save();

    // Send out email
    const html = `
      <p>Hello ${user.name || ""},</p>
      <p>Your password reset code is:</p>
      <h2 style="letter-spacing:6px">${otp}</h2>
      <p>This code is valid for ${Math.floor(OTP_EXPIRE_MS / 60000)} minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    `;
    await sendEmail({ to: user.email, subject: "Your password reset code", html });

    // Generic success message to prevent enumeration
    return res.json({ msg: "If an account exists for that email, an OTP has been sent." });
  } catch (err) {
    next(err);
  }
};

// 2) Reset password with OTP
export const resetPasswordWithOTP = async (req, res, next) => {
  try {
    // Basic request validation
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return res.status(400).json({ msg: "Email, OTP and new password are required." });
    }

    // Password policy: adjust as desired
    const pwRe = /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/;
    if (!pwRe.test(password)) {
      return res.status(400).json({ msg: "Password must be at least 8 characters, include upper and lower case letters and a number." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ msg: "Invalid OTP or expired." });

    // Check lockout
    if (user.resetOTPLockedUntil && user.resetOTPLockedUntil > Date.now()) {
      return res.status(429).json({ msg: "Too many failed attempts — try again later." });
    }

    if (!user.resetOTP || !user.resetOTPExpire || user.resetOTPExpire < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP." });
    }

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    // Safe comparison (hash strings)
    if (hashedOTP !== user.resetOTP) {
      // increment attempt counter
      user.resetOTPAttempts = (user.resetOTPAttempts || 0) + 1;
      if (user.resetOTPAttempts >= MAX_OTP_ATTEMPTS) {
        user.resetOTPLockedUntil = Date.now() + LOCK_DURATION_MS;
        await user.save();
        return res.status(429).json({ msg: "Too many failed attempts. You are temporarily locked out." });
      }
      await user.save();
      return res.status(400).json({ msg: "Invalid OTP." });
    }

    // OTP valid -> update password
    const hashedPassword = await bcrypt.hash(password, 12); // 12 salt rounds
    user.password = hashedPassword;
    // clear OTP fields and counters
    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;
    user.resetOTPAttempts = 0;
    user.resetOTPLockedUntil = undefined;

    await user.save();

    //send confirmation email
    await sendEmail({
      to: user.email,
      subject: "Your password was changed",
      html: `<p>Your password was changed successfully. If you didn't perform this action, contact support immediately.</p>`
    });

    return res.json({ msg: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};