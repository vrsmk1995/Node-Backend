const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    const ispasswordValid = await bcrypt.compare(password, user.password);
    if (!ispasswordValid) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ message: "Login Successful", token });
  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ message: "login Failed", error: err.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, age, Gender, phone, email, password } = req.body;

    //  Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already registered. Please login." });
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with ALL required fields
    const user = await User.create({
      name,
      age,
      Gender,
      phone,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({
      message: "SignUp Failed",
      error: err.message,
    });
  }
};
