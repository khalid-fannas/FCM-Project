const Vehicle = require("../models/VehicleModel");

function createVehicleFromData(vehicleData, id = null) {
  return new Vehicle(
    id,
    vehicleData.vehicle_type,
    vehicleData.model,
    vehicleData.manufacture_date,
    vehicleData.vin_number,
    vehicleData.exterior_color,
    vehicleData.interior_color,
    vehicleData.mileage,
    vehicleData.purchase_price,
    vehicleData.market_price,
    vehicleData.purchased_from,
    vehicleData.purchase_date,
    vehicleData.purchase_team,
    vehicleData.approved_by,
    vehicleData.buyer_id,
    vehicleData.created_by
  );
}

module.exports = { createVehicleFromData };
