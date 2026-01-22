const mongoose = require("../db");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Profile fields (optional at signup)
    age: { type: Number },
    Gender: { type: String },
    phone: { type: Number },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },

  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
