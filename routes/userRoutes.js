const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { default: mongoose } = require("mongoose");

// CREATE USER
router.post("/", async (req, res) => {
  const { name, age, email, phone } = req.body;
  if (!name || !age || !email || !phone) {
    return res.status(400).json({ message: "All Feilds are mandatory" });
  }
  if (age < 0) {
    return res.status(400).json({ message: "Age cannot be negative" });
  }

  if (phone.toString().length !== 10) {
    console.log("Received phone:", phone, typeof phone);
    return res.status(400).json({ message: "phone number must be 10 digits" });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ message: "invalid Email address" });
  }
  const user = await User.create(req.body);
  res.json(user);
});

// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    // 1️⃣ Pagination values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // 2️⃣ Build filter FIRST
    const filter = {};

    if (req.query.Gender) {
      filter.Gender = req.query.Gender;
    }

    if (req.query.minAge || req.query.maxAge) {
      filter.age = {};
      if (req.query.minAge) filter.age.$gte = parseInt(req.query.minAge);
      if (req.query.maxAge) filter.age.$lte = parseInt(req.query.maxAge);
    }

    // Sorting
    const sortBy = req.query.sortBy || "age";
    const sortOrder = req.query.sortOrder === "desc" ? -1 :1 ;
    const sortCriteria = {[sortBy]:sortOrder};
    // 3️⃣ Count filtered users
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    // 4️⃣ Fetch filtered + paginated users
    const users = await User.find(filter).sort(sortCriteria).skip(skip).limit(limit);

    // 5️⃣ Send response
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
});


// UPDATE USER
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
});

// DELETE USER
router.delete("/:id", async (req, res) => {
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
});

// Delete All Users

router.delete("/", async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: " All users deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: " Deleting all users Failed",
      error: err.message,
    });
  }
});

module.exports = router;
