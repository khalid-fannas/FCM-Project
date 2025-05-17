const Deduction = require("../models/DeductionModel");

function createDeductionFromData(data, id = null) {
  return new Deduction(
    id,
    data.employee_id,
    data.amount,
    "reason" in data
      ? data.reason === "" || data.reason === null
        ? null
        : data.reason
      : undefined,
    data.deduction_date
  );
}

module.exports = { createDeductionFromData };
