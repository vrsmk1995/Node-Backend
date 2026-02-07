const { default: mongoose } = require("mongoose");
const User = require("../models/user");

const userService = require("../services/userService");

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const { name, age, email, phone, password } = req.body;
    const user = await User.create({
      name,
      age,
      email,
      phone,
      password,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({
      message: "Error Creating User",
      error: err.message,
    });
  }
};

// GET ALL USERS

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.gender) filter.gender = req.query.gender;

    if (req.query.minAge || req.query.maxAge) {
      filter.age = {};
      if (req.query.minAge) filter.age.$gte = parseInt(req.query.minAge);
      if (req.query.maxAge) filter.age.$lte = parseInt(req.query.maxAge);
    }

    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }

    const sortBy = req.query.sortBy || "age";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    const sortCriteria = { [sortBy]: sortOrder };

    const { users, totalUsers } = await userService.getUsers({
      filter,
      sortCriteria,
      skip,
      limit,
    });

    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      page,
      limit,
      totalUsers,
      totalPages,
      users,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching users",
      error: err.message,
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({
      message: "Error updating user",
      error: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
};

// Delete All Users

exports.deleteAllusers = async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: " All users deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: " Deleting all users Failed",
      error: err.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "user not Found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching profile",
      error: err.message,
    });
  }
};

exports.makeAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        role: "admin",
      },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: "Error making update role",
      error: err.message,
    });
  }
};
