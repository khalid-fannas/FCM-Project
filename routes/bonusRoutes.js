const express = require("express");
const router = express.Router();

const { validateFields } = require("../middlewares/validateFields.js");

const {
  addBonus,
  updateBonus,
  getAllBonuses,
  getBonusById,
  deleteBonus,
} = require("../controllers/bonusController");

router.get("/all", getAllBonuses);

router.get("/:id", getBonusById);

router.post("/create", validateFields(), addBonus);

router.patch("/update/:id", validateFields(), updateBonus);

router.delete("/delete/:id", deleteBonus);

module.exports = router;
