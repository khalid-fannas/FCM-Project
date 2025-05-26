const express = require("express");
const router = express.Router();

const {
  addViolation,
  updateViolation,
  getAllViolations,
  getViolationById,
  deleteViolation,
} = require("../controllers/violationController");

const { validateFields } = require("../middlewares/validateFields");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { checkRoles } = require("../middlewares/authorizeRoles.js");

router.post(
  "/create",
  verifyToken,
  checkRoles("hr", "admin"),
  validateFields(["updated_by"]),
  addViolation
);

router.patch(
  "/update/:id",
  verifyToken,
  checkRoles("hr", "admin"),
  validateFields(["updated_by"]),
  updateViolation
);

router.get("/all", verifyToken, checkRoles("hr", "admin"), getAllViolations);

router.get("/:id", verifyToken, checkRoles("hr", "admin"), getViolationById);

router.delete(
  "/delete/:id",
  verifyToken,
  checkRoles("hr", "admin"),
  deleteViolation
);

module.exports = router;
