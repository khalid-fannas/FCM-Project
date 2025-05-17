const express = require("express");

const router = express.Router();

const { validateFields } = require("../middlewares/validateFields.js");

const {
  addVehicle,
  updateVehicle,
  getAllVehicles,
  getVehicleById,
  deleteVehicle,
} = require("../controllers/vehicleController.js");

router.get("/all", getAllVehicles);

router.get("/:id", getVehicleById);

router.post("/create", validateFields(), addVehicle);

router.patch("/update/:id", validateFields(), updateVehicle);

router.delete("/delete/:id", deleteVehicle);

module.exports = router;
