import { body } from "express-validator";

export const validateSignup = [
  // Name must not be empty after trimming whitespace
  body("name").trim().notEmpty().withMessage("Name is required"),

  // Email must be a valid email format
  body("email").isEmail().withMessage("Enter a valid email"),

  // Password validations:
  // - Minimum length 8 characters
  // - At least one uppercase letter
  // - At least one lowercase letter
  // - At least one number
  // - At least one special character (!@#$%^&*)
  body("password")
    .isLength({ min: 8 }).withMessage("Minimum 8 characters")
    .matches(/[A-Z]/).withMessage("At least one uppercase letter")
    .matches(/[a-z]/).withMessage("At least one lowercase letter")
    .matches(/\d/).withMessage("At least one number")
    .matches(/[!@#$%^&*]/).withMessage("At least one special character"),
];
