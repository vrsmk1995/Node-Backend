const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


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
      role:user.role,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
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
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid Email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid Email or password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token in DB
  user.refreshToken = refreshToken;
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
  const user = await User.findById(userId)
  if (!user) throw new Error("user not found");

  user.refreshToken = null;
  await user.save();
  return true
}