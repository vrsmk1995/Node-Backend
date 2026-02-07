const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: { type: String, required: true, minlength: 6 },

    // Profile fields (optional at signup)
    age: { type: Number },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    phone: { type: String },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
  },

  { timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
