const Vehicle = require("../models/VehicleModel");
const { handleControllerError } = require("../utils/controllerErrorHandler");
const { createVehicleFromData } = require("../factories/vehicleFactory");
const path = require("path");
const generateCarPdf = require("../utils/pdfVehicleGenerator");
const fs = require("fs");
const sgMail = require("@sendgrid/mail");
dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const addVehicle = async (req, res) => {
  try {
    const vehicleData = req.body;
    const vehicle = createVehicleFromData(vehicleData);

    if (vehicleData.vin_number.length !== 17) {
      return res.status(400).json({
        error: "VIN number must be exactly 17 characters long",
      });
    }

    const vehicleExists = await vehicle.checkVinNumber();
    if (vehicleExists > 0) {
      return res.status(400).json({ error: "Vehicle already exists" });
    }

    const result = await vehicle.create();
    res.status(201).json({
      message: "Vehicle record created successfully",
      vehicleId: result.insertId,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const vehicle = new Vehicle();
    const allVehicles = await vehicle.getAll();

    if (allVehicles.length === 0) {
      return res.status(404).json({ message: "No vehicle records found" });
    }

    res.status(200).json(allVehicles);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getVehicleById = async (req, res) => {
  try {
    const id = req.params.id;
    const vehicle = new Vehicle(id);

    const vehicleData = await vehicle.getById();
    if (!vehicleData) {
      return res
        .status(404)
        .json({ message: `Vehicle record with ID ${id} not found` });
    }

    res.status(200).json(vehicleData);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const updateVehicle = async (req, res) => {
  try {
    const id = req.params.id;
    const vehicleData = req.body;

    const vehicle = createVehicleFromData(vehicleData, id);

    const idCheck = await vehicle.getById();
    if (!idCheck) {
      return res
        .status(404)
        .json({ error: `Vehicle record with ID ${id} does not exist` });
    }

    const result = await vehicle.update();
    res.status(200).json({
      message: "Vehicle record updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const id = req.params.id;
    const vehicle = new Vehicle(id);

    const vehicleData = await vehicle.getById();
    if (!vehicleData) {
      return res
        .status(404)
        .json({ message: `Vehicle record with ID ${id} not found` });
    }

    const result = await vehicle.delete();
    res.status(200).json({
      message: "Vehicle record deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const generateVehiclePdf = async (req, res) => {
  try {
    const id = req.params.id;
    const userFile = req.file;

    if (!userFile) {
      return res.status(400).json({ message: "User PDF is required" });
    }

    const vehicle = new Vehicle(id);
    const vehicleData = await vehicle.getVehicleWithBuyer();

    if (!vehicleData) {
      return res
        .status(404)
        .json({ message: `Vehicle record with ID ${id} not found` });
    }

    const pdfBuffer = await generateCarPdf(vehicleData);
    const pdfFileName = `car-${vehicleData.vin_number.slice(-8)}.pdf`;

    const systemPdfBase64 = Buffer.from(pdfBuffer).toString("base64");
    const userPdfBase64 = Buffer.from(userFile.buffer).toString("base64");

    const msg = {
      to: "mafannas@gmail.com",
      from: "ahfannas@gmail.com",
      subject: `Purchase Order VIN#  ${vehicleData.vin_number}`,
      text: `Dears,\n\nHope this email finds you well, please find the attached files and proceed.\n\nBest regards`,
      attachments: [
        {
          content: systemPdfBase64,
          filename: pdfFileName,
          type: "application/pdf",
          disposition: "attachment",
        },
        {
          content: userPdfBase64,
          filename: userFile.originalname,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    await sgMail.send(msg);
    res.status(200).json({ message: "Email with both PDFs sent successfully" });
  } catch (err) {
    handleControllerError(err, res);
  }
};

module.exports = {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  generateVehiclePdf,
};
