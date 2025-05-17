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

router.post("/create", validateFields(["role"]), addUser);

router.get("/all", getAllUsers);

router.get("/:id", getUserById);

router.patch("/update/:id", validateFields(["role"]), updateUser);

router.delete("/delete/:id", deleteUser);

module.exports = router;
