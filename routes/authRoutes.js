const express = require("express");
const router = express.Router();

const { verifyResetCookie } = require("../middlewares/authMiddleware");

const {
  logIn,
  setNewPassword,
  refreshToken,
  logOut,
} = require("../controllers/authController");

router.post("/login", logIn);

router.get("/setPassword", verifyResetCookie, (req, res) => {
  res.render("setNewPassword", { user: req.user });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/setPassword", verifyResetCookie, setNewPassword);

router.post("/refreshToken", refreshToken);

router.get("/logout", logOut);

module.exports = router;
