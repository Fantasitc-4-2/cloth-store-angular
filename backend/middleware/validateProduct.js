import { body, validationResult } from "express-validator";

export const validateProduct = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 10, max: 1000 }).withMessage("Description must be between 10 and 1000 characters"),

  body("category")
    .notEmpty().withMessage("Category is required")
    .isMongoId().withMessage("Category must be a valid Mongo ID"),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 1, max: 100000 }).withMessage("Price must be between 1 and 100000"),

  // body("stock")
  //   .notEmpty().withMessage("Stock is required")
  //   .isInt({ min: 0 }).withMessage("Stock cannot be negative"),

  body("createdBy")
    .notEmpty().withMessage("CreatedBy is required")
    .isMongoId().withMessage("CreatedBy must be a valid Mongo ID"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];
