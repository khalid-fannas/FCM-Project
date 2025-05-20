const express = require("express");
const router = express.Router();

const {
  addViolationRecord,
  updateViolationRecord,
  getAllViolationRecords,
  getViolationRecordById,
  deleteViolationRecord,
} = require("../controllers/violationsEmployeeRecordController");

const { validateFields } = require("../middlewares/validateFields");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { checkRoles } = require("../middlewares/authorizeRoles.js");

router.post(
  "/create",
  verifyToken,
  checkRoles("hr , admin"),
  validateFields(["reason"]),
  addViolationRecord
);

router.patch(
  "/update/:id",
  verifyToken,
  checkRoles("hr , admin"),
  validateFields(["reason"]),
  updateViolationRecord
);

router.get(
  "/all",
  verifyToken,
  checkRoles("hr , admin"),
  getAllViolationRecords
);

router.get(
  "/:id",
  verifyToken,
  checkRoles("hr , admin"),
  getViolationRecordById
);

router.delete(
  "/delete/:id",
  verifyToken,
  checkRoles("hr , admin"),
  deleteViolationRecord
);

module.exports = router;
