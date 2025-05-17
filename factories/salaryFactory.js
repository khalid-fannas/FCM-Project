const Salary = require("../models/SalaryModel");

function createSalaryFromData(salaryData, id = null) {
  return new Salary(
    id,
    salaryData.employee_id,
    salaryData.base_salary,
    salaryData.total_bonuses,
    salaryData.total_deductions,
    salaryData.payment_date
  );
}

module.exports = { createSalaryFromData };
