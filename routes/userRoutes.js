const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { allowOnly } = require("../middleware/whitelist");
const adminsOnly = require("../middleware/roleMiddleware");

const {
  getProfile,
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  deleteAllusers,
  makeAdmin,
  removeAdmin,
} = require("../controllers/userController");
const {
  updateProfileValidator,
} = require("../middleware/validators/authValidator");
const validate = require("../middleware/validators/validate");
const { authLimiter } = require("../middleware/rateLimit");

router.post("/", createUser);
router.get("/", getUsers);
router.put(
  "/:id",
  auth,
  authLimiter,
  allowOnly(["age", "gender", "phone"]),
  updateProfileValidator,
  validate,
  updateUser,
);
router.delete("/:id", deleteUser);
router.delete("/", auth, adminsOnly(["admin"]), deleteAllusers);
router.get("/profile", auth, getProfile);
router.put("/update-role/:id", auth, adminsOnly, makeAdmin);
router.put("/remove-admin/:id", auth, adminsOnly, removeAdmin);



module.exports = router;
