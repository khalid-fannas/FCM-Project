const ViolationsEmployeeRecord = require("../models/ViolationsEmployeeRecord");

function createViolationRecordFromData(data, id = null) {
  return new ViolationsEmployeeRecord(
    id,
    data.reported_by,
    data.offender_id,
    data.violation_id,
    "reason" in data
      ? data.reason === "" || data.reason === null
        ? null
        : data.reason
      : undefined,
    data.reason_type || "manual"
  );
}

module.exports = { createViolationRecordFromData };
