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

router.post(
  "/create",
  validateFields(["check_in", "check_out"]),
  addAttendance
);

router.patch(
  "/update/:id",
  validateFields(["check_in", "check_out"]),
  updateAttendance
);

router.get("/all", getAllAttendances);

router.get("/:id", getAttendanceById);

router.delete("/delete/:id", deleteAttendance);

module.exports = router;
