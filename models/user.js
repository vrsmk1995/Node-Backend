const mongoose = require("../db");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    Gender: { type: String, required: true },
    phone: { type: Number, required: true, min: 1000000000, max: 9999999999 },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("User", userSchema);
