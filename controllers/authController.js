const User = require("../models/user");
const authService = require("../services/authService");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { successResponse } = require("../utils/responseHandler");

// SIGNUP
exports.signup = catchAsync(async (req, res, next) => {
  const user = await authService.signup(req.body);

  if (!user) {
    return next(new AppError("Signup failed", 400));
  }

  const { password, ...safeUser } = user;

  return successResponse(
    res,
    "User Registered Successfully",
    { user: safeUser },
    201,
  );
});

// LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const result = await authService.login(req.body);

  if (!result) {
    return next(new AppError("Login failed", 400));
  }
  return successResponse(res, "Login Successful", result);
});

// LOGOUT
exports.logout = catchAsync(async (req, res, next) => {
  if (!req.userId) {
    return next(new AppError("Unauthorized request", 401));
  }

  await authService.logout(req.userId);

  return successResponse(res, "Logout Successful");
});

// REFRESH TOKEN
exports.refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError("Refresh Token Required", 400));
  }

  const result = await authService.rotateRefreshToken(refreshToken);

  return successResponse(res, "Token Refreshed", result);
});

// FORGOT PASSWORD
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const token = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;

  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_USER,
    subject: "Reset Password",
    text: `Click this link to reset password: http://localhost:3000/reset/${token}`,
  };

  await transporter.sendMail(mailOptions);
  return successResponse(res, "Password reset email sent");
});

// RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token) {
    return next(new AppError("Token is required", 400));
  }

  if (!newPassword) {
    return next(new AppError("New password is required", 400));
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or expired token", 400));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return successResponse(res, "Password reset successful");
});

// CHANGE PASSWORD
exports.changePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(new AppError("Old and new password are required", 400));
  }

  const user = await User.findById(req.userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return next(new AppError("Old password is incorrect", 400));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  // logout all sessions
  user.refreshToken = null;

  await user.save();

  return successResponse(res, "Password changed successfully");
});
