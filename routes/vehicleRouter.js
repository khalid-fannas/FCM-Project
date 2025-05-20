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
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { checkRoles } = require("../middlewares/authorizeRoles.js");

router.get(
  "/all",
  verifyToken,
  checkRoles("data_entry", "admin"),
  getAllVehicles
);

router.get(
  "/:id",
  verifyToken,
  checkRoles("data_entry", "admin"),
  getVehicleById
);

router.post(
  "/create",
  verifyToken,
  checkRoles("data_entry", "admin"),
  validateFields(),
  addVehicle
);

router.patch(
  "/update/:id",
  verifyToken,
  checkRoles("data_entry", "admin"),
  validateFields(),
  updateVehicle
);

router.delete(
  "/delete/:id",
  verifyToken,
  checkRoles("data_entry", "admin"),
  deleteVehicle
);

router.post(
  "/sendEmail/:id",
  verifyToken,
  checkRoles("data_entry", "admin"),
  uploadPdf.single("userPdf"),
  multerErrorHandler,
  generateVehiclePdf
);

module.exports = router;
