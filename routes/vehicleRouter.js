const express = require("express");

const router = express.Router();

const { validateFields } = require("../middlewares/validateFields.js");

const {
  addVehicle,
  updateVehicle,
  getAllVehicles,
  getVehicleById,
  deleteVehicle,
  generateVehiclePdf,
} = require("../controllers/vehicleController.js");
const uploadPdf = require("../utils/uploadPdf");
const multerErrorHandler = require("../middlewares/multerErrorHandler");

router.get("/all", getAllVehicles);

router.get("/:id", getVehicleById);

router.post("/create", validateFields(), addVehicle);

router.patch("/update/:id", validateFields(), updateVehicle);

router.delete("/delete/:id", deleteVehicle);

router.get(
  "/sendEmail/:id",
  uploadPdf.single("userPdf"),
  multerErrorHandler,
  generateVehiclePdf
);

module.exports = router;
