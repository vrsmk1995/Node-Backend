const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (userData) => {
  const { email, password } = req.body;

  //  Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already registered. Please login.");
  }

  //  Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user with ALL required fields
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

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid Email or password");
  }
  const ispasswordValid = await bcrypt.compare(password, user.password);
  if (!ispasswordValid) {
    throw new Error("Invalid Email or password");
  }
  const token = jwt.sign(
    {
      user: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
