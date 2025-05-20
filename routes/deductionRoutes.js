const express = require("express");
const router = express.Router();

const {
  addDeduction,
  updateDeduction,
  getAllDeductions,
  getDeductionById,
  deleteDeduction,
} = require("../controllers/deductionController");

const { validateFields } = require("../middlewares/validateFields");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { checkRoles } = require("../middlewares/authorizeRoles.js");

router.post(
  "/create",
  verifyToken,
  checkRoles("hr , admin"),
  validateFields(["reason"]),
  addDeduction
);

router.patch(
  "/update/:id",
  verifyToken,
  checkRoles("hr , admin"),
  validateFields(["reason"]),
  updateDeduction
);

router.get("/all", verifyToken, checkRoles("hr , admin"), getAllDeductions);

router.get("/:id", verifyToken, checkRoles("hr , admin"), getDeductionById);

router.delete(
  "/delete/:id",
  verifyToken,
  checkRoles("hr , admin"),
  deleteDeduction
);

module.exports = router;
