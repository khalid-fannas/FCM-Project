const User = require("../models/UserModel");

function createUserFromData(userData, id = null) {
  return new User({
    id,
    employee_id: userData.employee_id,
    work_email: userData.work_email,
    password: userData.password,
    role: userData.role,
  });
}

module.exports = { createUserFromData };
