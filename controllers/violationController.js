const Violation = require("../models/ViolationModel");
const { createViolationFromData } = require("../factories/violationFactory");
const { handleControllerError } = require("../utils/controllerErrorHandler");

const addViolation = async (req, res) => {
  try {
    const violationData = req.body;
    const violation = createViolationFromData(violationData);
    const result = await violation.create();

    res.status(201).json({
      message: "Violation record created successfully",
      violationId: result.insertId,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getAllViolations = async (req, res) => {
  try {
    const violation = new Violation();
    const violations = await violation.getAll();

    if (violations.length === 0) {
      return res.status(404).json({ message: "No violation records found" });
    }

    res.status(200).json(violations);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getViolationById = async (req, res) => {
  try {
    const id = req.params.id;
    const violation = new Violation(id);
    const violationData = await violation.getById();

    if (!violationData) {
      return res
        .status(404)
        .json({ message: `Violation with ID ${id} not found` });
    }

    res.status(200).json(violationData);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const updateViolation = async (req, res) => {
  try {
    const id = req.params.id;
    const violationData = req.body;

    const violation = createViolationFromData(violationData, id);
    const existing = await violation.getById();

    if (!existing) {
      return res
        .status(404)
        .json({ error: `Violation with ID ${id} does not exist` });
    }

    const result = await violation.update();

    res.status(200).json({
      message: "Violation record updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const deleteViolation = async (req, res) => {
  try {
    const id = req.params.id;
    const violation = new Violation(id);
    const existing = await violation.getById();

    if (!existing) {
      return res
        .status(404)
        .json({ message: `Violation with ID ${id} not found` });
    }

    const result = await violation.delete();

    res.status(200).json({
      message: "Violation record deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

module.exports = {
  addViolation,
  getAllViolations,
  getViolationById,
  updateViolation,
  deleteViolation,
};
