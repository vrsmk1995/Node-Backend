const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const crypto = require("crypto");

// Token Helpers

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      user: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      user: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
};

//RefreshTokenRotation

exports.rotateRefreshToken = async (oldRefreshToken) => {
  let decoded;

  try {
    decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new AppError("Invalid refresh token", 401);
  }

  const user = await User.findById(decoded.user).select("+refreshToken");

  if (!user) {
    throw new AppError("Invalid refresh token", 401);
  }

  // Hash incoming token before comparing
  const hashedIncomingToken = crypto
    .createHash("sha256")
    .update(oldRefreshToken)
    .digest("hex");

  if (user.refreshToken !== hashedIncomingToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  const hashedNewRefreshToken = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  user.refreshToken = hashedNewRefreshToken;
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// Signup

exports.signup = async (userData) => {
  const { email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already registered. Please login.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    ...userData,
    password: hashedPassword,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

// Login (With Refresh Token)

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (user.isLocked) {
    throw new AppError(
      "Account locked due to multiple failed login attempts. Try again later.",
      423,
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    await user.incrementLoginAttempts(); // 🔥 IMPORTANT
    throw new AppError("Invalid credentials", 401);
  }

  await user.resetLoginAttempts();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  user.refreshToken = hashedRefreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};


exports.logout = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("user not found");

  user.refreshToken = null;
  await user.save();
  return true;
};
