import { body } from "express-validator";

export const validateItinerary = [
  // City must not be empty
  body("city").notEmpty().withMessage("City is required"),

  // Start time must be provided and a valid ISO8601 date string
  body("startTime").notEmpty().isISO8601().withMessage("Valid start time required"),

  // End time must be provided and a valid ISO8601 date string
  body("endTime").notEmpty().isISO8601().withMessage("Valid end time required"),

  // Places must be an array with at least one element
  body("places").isArray({ min: 1 }).withMessage("At least one place required"),
];
