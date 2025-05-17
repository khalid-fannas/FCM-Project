const Shift = require("../models/ShiftModel");

function createShiftFromData(shiftData, id = null) {
  return new Shift(
    id,
    shiftData.name,
    shiftData.start_time,
    shiftData.end_time
  );
}

module.exports = { createShiftFromData };
