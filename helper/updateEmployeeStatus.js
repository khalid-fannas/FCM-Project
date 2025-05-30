const Employee = require("../models/EmployeeModel");
const ViolationsEmployeeRecord = require("../models/ViolationsEmployeeRecord");

async function updateEmployeeStatus(employeeId) {
  const totalWeight =
    await ViolationsEmployeeRecord.getEmployeeTotalViolationWeight(employeeId);

  const employee = new Employee(employeeId);
  if (totalWeight >= 3) {
    await employee.setStatus("inactive");
  } else {
    await employee.setStatus("active");
  }
}

module.exports = { updateEmployeeStatus };
