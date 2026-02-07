const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { allowOnly } = require("../middleware/whitelist");
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
const {
  updateProfileValidator,
} = require("../middleware/validators/authValidator");
const validate = require("../middleware/validators/validate");

router.post("/", createUser);
router.get("/", getUsers);
router.put(
  "/:id",
  auth,
  allowOnly(["age", "gender", "phone"]),
  updateProfileValidator,
  validate,
  updateUser,
);
router.delete("/:id", deleteUser);
router.delete("/", auth, adminsOnly, deleteAllusers);
router.get("/profile", auth, getProfile);
router.put("/make-admin/:id", auth, adminsOnly, makeAdmin);

module.exports = router;
