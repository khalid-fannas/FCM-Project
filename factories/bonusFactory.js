const Bonus = require("../models/BonusModel");

function createBonusFromData(bonusData, id = null) {
  return new Bonus(id, bonusData.employee_id, bonusData.vehicle_id);
}

module.exports = { createBonusFromData };
