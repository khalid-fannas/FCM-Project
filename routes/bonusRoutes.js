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
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { checkRoles } = require("../middlewares/authorizeRoles.js");

router.get(
  "/all",
  verifyToken,
  checkRoles("hr , admin"),
  verifyToken,
  checkRoles("hr , admin"),
  getAllBonuses
);

router.get("/:id", verifyToken, checkRoles("hr , admin"), getBonusById);

router.post(
  "/create",
  verifyToken,
  checkRoles("hr , admin"),
  validateFields(),
  addBonus
);

router.patch(
  "/update/:id",
  verifyToken,
  checkRoles("hr , admin"),
  validateFields(),
  updateBonus
);

router.delete(
  "/delete/:id",
  verifyToken,
  checkRoles("hr , admin"),
  deleteBonus
);

module.exports = router;
