const Violation = require("../models/ViolationModel");

function createViolationFromData(violationData, id = null) {
  return new Violation(
    id,
    violationData.title,
    violationData.description,
    violationData.type,
    violationData.created_by,
    "updated_by" in violationData ? violationData.updated_by : undefined
  );
}

module.exports = { createViolationFromData };
