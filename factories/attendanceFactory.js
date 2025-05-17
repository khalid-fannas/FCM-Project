const Attendance = require("../models/AttendanceModel");

function createAttendanceFromData(attendanceData, id = null) {
  return new Attendance(
    id,
    attendanceData.employee_id,
    attendanceData.shifts_id,
    attendanceData.date,
    "check_in" in attendanceData ? attendanceData.check_in : undefined,
    "check_out" in attendanceData ? attendanceData.check_out : undefined
  );
}

module.exports = { createAttendanceFromData };
