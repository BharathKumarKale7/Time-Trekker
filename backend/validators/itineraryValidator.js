import { body } from "express-validator";

export const validateItinerary = [
  body("city").notEmpty().withMessage("City is required"),
  body("startTime").notEmpty().isISO8601().withMessage("Valid start time required"),
  body("endTime").notEmpty().isISO8601().withMessage("Valid end time required"),
  body("places").isArray({ min: 1 }).withMessage("At least one place required"),
];
