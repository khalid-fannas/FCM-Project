const Salary = require("../models/SalaryModel");

function createSalaryFromData(salaryData, id = null) {
  return new Salary(id, salaryData.employee_id, salaryData.base_salary);
}

module.exports = { createSalaryFromData };
