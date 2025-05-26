const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createUserFromData } = require("../factories/userFactory");
const { handleControllerError } = require("../utils/controllerErrorHandler");
const dotenv = require("dotenv");
dotenv.config({ path: require("path").join(__dirname, "../.env") });
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const addUser = async (req, res) => {
  try {
    const userData = req.body;

    const rawPassword = crypto.randomBytes(6).toString("base64").slice(0, 10);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    const user = new User({
      employee_id: userData.employee_id,
      work_email: userData.work_email,
      password: hashedPassword,
      role: userData.role,
    });

    const existingUser = await user.checkEmail();
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const result = await user.create();

    if (!result || result.affectedRows === 0) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    const getUserFullName = await User.getUserFullName(result.insertId);

    const msg = {
      to: "kha2000.khaled@gmail.com",
      from: "ahfannas@gmail.com",
      subject: "Your New Account Credentials",
      text: `Dear ${getUserFullName},\n\nYour account has been created successfully. Here are your login details:\n\nEmail: ${userData.work_email}\nTemporary Password: ${rawPassword}\n\nPlease log in and change your password as soon as possible.\n\nBest regards,\nHR Team`,
    };

    await sgMail.send(msg);

    res.status(201).json({
      message: "User created successfully and email sent with temp Password",
      userId: result.insertId,
      temporaryPassword: rawPassword,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = new User({});
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
    const user = new User({ id });
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

    if (userData.password && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        error: "You are not allowed to change another user's password",
      });
    }

    if (userData.password && req.user.id === parseInt(id)) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      userData.password = hashedPassword;
    }

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
    const user = new User({ id });
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
