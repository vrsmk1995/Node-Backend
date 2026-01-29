const { body } = require("express-validator");

exports.signupValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .matches(/^[A-Za-z ]{3,}$/)
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .withMessage(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
    ),
];

exports.loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .withMessage(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
    ),
];

exports.updateProfileValidator = [
  body("age")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Age must be a positive number"),

  body("Gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other"),

  body("phone")
    .optional()
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits")
    .isNumeric()
    .withMessage("Phone must contain only numbers"),
];