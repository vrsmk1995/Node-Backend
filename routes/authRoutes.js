const express = require("express");
const router = express.Router();
const { login, signup } = require("../controllers/authController");
const { signupValidator ,loginValidator } = require("../middleware/validators/authValidator");
const validate = require("../middleware/validators/validate");
const { authLimiter } = require("../middleware/rateLimit");

router.post("/signup", authLimiter, signupValidator, validate, signup);
router.post("/login", authLimiter, loginValidator, validate, login);

module.exports = router;
