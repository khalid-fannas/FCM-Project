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
      return res.status(404).json({ message: "User not found" });
    }

    if (userData.employee_status !== "active") {
      return res
        .status(403)
        .json({ message: "Only Active Employee Can Access" });
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: "Invalid email or password" });
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

      return res.json({ redirect: "/api/auth/setPassword" });
    }

    const accessToken = jwt.sign(
      { id: userData.id, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: userData.id, role: userData.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("/api/dashboard");
  } catch (err) {
    handleControllerError(err, res);
  }
};

const setNewPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || newPassword.trim().length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (!confirmPassword || newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
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
        .json({ message: "User not found or password not updated" });
    }

    const accessToken = jwt.sign(
      { id: userId, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: userId, role: req.user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.clearCookie("reset_token");

    return res.json({ redirect: "/api/dashboard" });
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

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 16 * 60 * 1000,
    });

    return res.status(200).json({ message: "Access token refreshed" });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

const logOut = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.redirect("/api/auth/login");
};

module.exports = {
  logIn,
  setNewPassword,
  refreshToken,
  logOut,
};
