const LateEntry = require("../models/LateEntriesModel");

function createLateEntryFromData(entryData, id = null) {
  return new LateEntry(
    id,
    entryData.employee_id,
    entryData.date,
    entryData.minutes_late,
    "reason" in entryData
      ? entryData.reason === "" || entryData.reason === null
        ? null
        : entryData.reason
      : undefined,
    "excuse" in entryData ? entryData.excuse : undefined,
    entryData.created_by,
    "updated_by" in entryData ? entryData.updated_by : undefined
  );
}

module.exports = { createLateEntryFromData };
