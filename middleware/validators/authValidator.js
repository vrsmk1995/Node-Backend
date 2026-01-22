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
  body("age")
    .notEmpty()
    .withMessage("Age is required")
    .isInt({ min: 0 })
    .withMessage("Age must be a positive number"),

  body("Gender").notEmpty().withMessage("Gender is required"),

  body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits")
    .isNumeric()
    .withMessage("Phone must contain only numbers"),
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
