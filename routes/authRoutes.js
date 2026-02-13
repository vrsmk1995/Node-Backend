const express = require("express");
const router = express.Router();


const {
  login,
  signup,
  logout,
  refreshToken,
  resetPassword,
  forgotPassword,
  changePassword,
} = require("../controllers/authController");

const {
  signupValidator,
  loginValidator,

} = require("../middleware/validators/authValidator");

const validate = require("../middleware/validators/validate");
const {
  signupLimiter,
  loginLimiter,
  passwordLimiter,
} = require("../middleware/rateLimit");

const { allowOnly } = require("../middleware/whitelist");
const authMiddleware = require("../middleware/authMiddleware");

console.log("AUTH ROUTES FILE LOADED");

router.post(
  "/signup",
  signupLimiter,
  allowOnly(["name", "email", "password"]),
  signupValidator,
  validate,
  signup,
);
router.post("/login", loginValidator, validate, loginLimiter, login);
router.post("/logout", authMiddleware, logout);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", passwordLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
