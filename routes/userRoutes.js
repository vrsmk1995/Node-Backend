const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const adminsOnly = require("../middleware/adminMiddleWare");

const {
  getProfile,
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  deleteAllusers,
  makeAdmin,
} = require("../controllers/userController");

router.post("/", createUser);
router.get("/", getUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.delete("/", auth, adminsOnly, deleteAllusers);
router.get("/profile", auth, getProfile);
router.put("/make-admin/:id", auth, adminsOnly, makeAdmin);

module.exports = router;
