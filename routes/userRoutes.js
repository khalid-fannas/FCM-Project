const express = require("express");
const router = express.Router();

const {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const { validateFields } = require("../middlewares/validateFields");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { checkRoles } = require("../middlewares/authorizeRoles.js");

router.post(
  "/create",
  verifyToken,
  checkRoles("admin"),
  validateFields(["role"]),
  addUser
);

router.get("/management", verifyToken, checkRoles("admin"), (req, res) => {
  res.render("users");
});

router.get("/all", verifyToken, checkRoles("admin"), getAllUsers);

router.get("/:id", verifyToken, checkRoles("admin"), getUserById);

router.patch(
  "/update/:id",
  verifyToken,
  checkRoles("admin"),
  validateFields(["role"]),
  updateUser
);

router.delete("/delete/:id", verifyToken, checkRoles("admin"), deleteUser);

module.exports = router;
