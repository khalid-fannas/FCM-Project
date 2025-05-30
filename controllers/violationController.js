const Violation = require("../models/ViolationModel");
const { createViolationFromData } = require("../factories/violationFactory");
const { handleControllerError } = require("../utils/controllerErrorHandler");
const User = require("../models/UserModel");

const addViolation = async (req, res) => {
  try {
    const violationData = req.body;
    const userId = req.user.id;
    const user = new User({ id: userId });
    const userData = await user.getById();
    violationData.created_by = userData.employee_id;

    const title = violationData.title.trim().toLowerCase();

    const existingViolation = await Violation.findByTitle(title);
    if (existingViolation) {
      return res.status(400).json({
        error: "A violation with this title already exists.",
      });
    }

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

    res.status(200).json(violations);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const returnAllViolations = async (req, res) => {
  try {
    const violation = new Violation();
    const violations = await violation.getAll();

    return violations;
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

    if (violationData.title) {
      const newTitle = violationData.title.trim().toLowerCase();
      const existingViolation = await Violation.findByTitle(newTitle);

      if (existingViolation && existingViolation.id != id) {
        return res.status(400).json({
          error: "A violation with this title already exists.",
        });
      }
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
  returnAllViolations,
};
