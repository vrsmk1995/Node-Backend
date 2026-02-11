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
  updateProfileValidator,
} = require("../middleware/validators/authValidator");

const validate = require("../middleware/validators/validate");
const { authLimiter } = require("../middleware/rateLimit");
const { updateUser } = require("../controllers/userController");
const { allowOnly } = require("../middleware/whitelist");
const authMiddleware = require("../middleware/authMiddleware");

console.log("AUTH ROUTES FILE LOADED");

router.post(
  "/signup",
  authLimiter,
  allowOnly(["name", "email", "password"]),
  signupValidator,
  validate,
  signup,
);
router.post("/login", authLimiter, loginValidator, validate, login);
router.post("/logout", authLimiter, authMiddleware, logout);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", authLimiter, authMiddleware, changePassword);

module.exports = router;
