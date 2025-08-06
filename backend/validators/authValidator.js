import { body } from "express-validator";

export const validateSignup = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password")
    .isLength({ min: 8 }).withMessage("Minimum 8 characters")
    .matches(/[A-Z]/).withMessage("At least one uppercase letter")
    .matches(/[a-z]/).withMessage("At least one lowercase letter")
    .matches(/\d/).withMessage("At least one number")
    .matches(/[!@#$%^&*]/).withMessage("At least one special character"),
];
