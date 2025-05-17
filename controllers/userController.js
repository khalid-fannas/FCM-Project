const User = require("../models/UserModel");
const { createUserFromData } = require("../factories/userFactory");
const { handleControllerError } = require("../utils/controllerErrorHandler");

const addUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = createUserFromData(userData);

    const existingUser = await user.checkEmail();
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const result = await user.create();

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = new User();
    const users = await user.getAll();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = new User(id);
    const userData = await user.getById();

    if (!userData) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    res.status(200).json(userData);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userData = req.body;

    const user = createUserFromData(userData, id);
    const existingUser = await user.getById();

    if (!existingUser) {
      return res
        .status(404)
        .json({ error: `User with ID ${id} does not exist` });
    }

    const result = await user.update();
    res.status(200).json({
      message: "User updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = new User(id);
    const existingUser = await user.getById();

    if (!existingUser) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    const result = await user.delete();
    res.status(200).json({
      message: "User deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
