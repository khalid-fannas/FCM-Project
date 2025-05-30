const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { verifyToken } = require("../middlewares/authMiddleware.js");

router.get("/", verifyToken, (req, res) => {
  res.render("dashboard");
});

router.get("/overview", dashboardController.getOverviewStats);

module.exports = router;
