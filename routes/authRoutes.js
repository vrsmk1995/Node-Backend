const express = require("express");
const router = express.Router();
const { login, signup } = require("../controllers/authController");
const { signupValidator ,loginValidator } = require("../middleware/validators/authValidator");
const validate = require("../middleware/validators/validate");

router.post("/signup", signupValidator, validate, signup);
router.post("/login",loginValidator, validate, login);

module.exports = router;
