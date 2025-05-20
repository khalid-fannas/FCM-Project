const express = require("express");
const router = express.Router();

const { verifyResetCookie } = require("../middlewares/authMiddleware");

const {
  logIn,
  setNewPassword,
  refreshToken,
} = require("../controllers/authController");

router.post("/login", logIn);

router.post("/setPassword", verifyResetCookie, setNewPassword);

router.post("/refreshToken", refreshToken);

module.exports = router;
