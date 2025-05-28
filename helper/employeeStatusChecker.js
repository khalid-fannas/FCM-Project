const Employee = require("../models/EmployeeModel");

async function validateActiveEmployee(employeeId) {
  const employee = new Employee(employeeId);
  const employeeStatus = await employee.getById();
  if (!employeeStatus) {
    throw new Error(`Employee with ID ${employeeId} not found.`);
  }
  if (employeeStatus.status !== "active") {
    throw new Error(`Employee with ID ${employeeId} is inactive.`);
  }
}

module.exports = { validateActiveEmployee };
