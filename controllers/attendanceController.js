const Attendance = require("../models/AttendanceModel");
const { createAttendanceFromData } = require("../factories/attendanceFactory");
const { handleControllerError } = require("../utils/controllerErrorHandler");

const addAttendance = async (req, res) => {
  try {
    const attendanceData = req.body;
    const attendance = createAttendanceFromData(attendanceData);

    const result = await attendance.create();
    res.status(201).json({
      message: "Attendance record created successfully",
      attendanceId: result.insertId,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getAllAttendances = async (req, res) => {
  try {
    const attendance = new Attendance();
    const allAttendances = await attendance.getAll();

    if (allAttendances.length === 0) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    res.status(200).json(allAttendances);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const id = req.params.id;
    const attendance = new Attendance(id);

    const attendanceData = await attendance.getById();
    if (!attendanceData) {
      return res
        .status(404)
        .json({ message: `Attendance record with ID ${id} not found` });
    }

    res.status(200).json(attendanceData);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const updateAttendance = async (req, res) => {
  try {
    const id = req.params.id;
    const attendanceData = req.body;

    const attendance = createAttendanceFromData(attendanceData, id);
    const existingAttendance = await attendance.getById();

    if (!existingAttendance) {
      return res
        .status(404)
        .json({ error: `Attendance record with ID ${id} does not exist` });
    }

    const result = await attendance.update();
    res.status(200).json({
      message: "Attendance record updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const id = req.params.id;
    const attendance = new Attendance(id);

    const existingAttendance = await attendance.getById();
    if (!existingAttendance) {
      return res
        .status(404)
        .json({ message: `Attendance record with ID ${id} not found` });
    }

    const result = await attendance.delete();
    res.status(200).json({
      message: "Attendance record deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

module.exports = {
  addAttendance,
  getAllAttendances,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
};
