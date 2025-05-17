const Employee = require("../models/EmployeeModel");

function createEmployeeFromData(employeeData, id = null) {
  return new Employee(
    id,
    employeeData.first_name,
    employeeData.last_name,
    employeeData.email,
    employeeData.phone_number,
    employeeData.address,
    employeeData.personal_picture,
    employeeData.department_name,
    employeeData.position_name,
    employeeData.shift_id,
    employeeData.hire_date,
    employeeData.salary_base,
    employeeData.status
  );
}

module.exports = { createEmployeeFromData };
