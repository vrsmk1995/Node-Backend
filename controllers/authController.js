const authService = require("../services/authService");

exports.signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({
      message: "Signup failed",
      error: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    res.json({
      message: "Login successful",
      ...result,
    });
  } catch (err) {
    res.status(400).json({
      message: "Login failed",
      error: err.message,
    });
  }
};
