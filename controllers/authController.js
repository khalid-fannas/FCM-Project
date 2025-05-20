const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const User = require("../models/UserModel");
const { handleControllerError } = require("../utils/controllerErrorHandler");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ work_email: email });

    const userData = await user.getByEmail();
    if (!userData) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (userData.first_login) {
      const tempPayload = {
        id: userData.id,
        role: userData.role,
        purpose: "password_reset",
      };
      const tempToken = jwt.sign(tempPayload, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      res.cookie("reset_token", tempToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "Strict",
      });

      return res.status(200).json({
        message: "First login - password reset required",
        requirePasswordReset: true,
      });
    }

    const accessToken = jwt.sign(
      { id: userData.id, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: "15min" }
    );

    const refreshToken = jwt.sign(
      { id: userData.id, role: userData.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      userId: userData.id,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const setNewPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.trim().length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = new User({
      id: userId,
      password: hashedPassword,
      first_login: false,
    });
    const updateResult = await user.updatePasswordAndFlag();

    if (updateResult.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "User not found or password not updated" });
    }

    res.clearCookie("reset_token");

    res
      .status(200)
      .json({ message: "Password updated successfully. You can now log in." });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const refreshToken = (req, res) => {
  const token = req.cookies?.refresh_token;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "15min" }
    );

    return res.status(200).json({ accessToken });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

module.exports = {
  logIn,
  setNewPassword,
  refreshToken,
};
