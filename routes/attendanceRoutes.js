const express = require("express");
const router = express.Router();

const {
  addAttendance,
  updateAttendance,
  getAllAttendances,
  getAttendanceById,
  deleteAttendance,
} = require("../controllers/attendanceController");

const { validateFields } = require("../middlewares/validateFields");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { checkRoles } = require("../middlewares/authorizeRoles.js");

router.post(
  "/create",
  verifyToken,
  checkRoles("hr , admin"),
  validateFields(["check_in", "check_out"]),
  addAttendance
);

router.patch(
  "/update/:id",
  verifyToken,
  checkRoles("hr , admin"),
  validateFields(["check_in", "check_out"]),
  updateAttendance
);

router.get("/all", verifyToken, checkRoles("hr , admin"), getAllAttendances);

router.get("/:id", verifyToken, checkRoles("hr , admin"), getAttendanceById);

router.delete(
  "/delete/:id",
  verifyToken,
  checkRoles("hr , admin"),
  deleteAttendance
);

module.exports = router;
