const User = require("../models/UserModel");

function createUserFromData(userData, id = null) {
  return new User(
    id,
    userData.employee_id,
    userData.work_email,
    userData.password,
    userData.role
  );
}

module.exports = { createUserFromData };
