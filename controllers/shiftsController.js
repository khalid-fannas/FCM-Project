const Shift = require("../models/ShiftModel");
const { handleControllerError } = require("../utils/controllerErrorHandler");
const { createShiftFromData } = require("../factories/shiftFactory");

const addShift = async (req, res) => {
  try {
    const shiftData = req.body;

    const shift = createShiftFromData(shiftData);
    const result = await shift.create();

    res.status(201).json({
      message: "Shift created successfully",
      shiftId: result.insertId,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getAllShifts = async (req, res) => {
  try {
    const shift = new Shift();
    const allShifts = await shift.getAll();

    if (allShifts.length === 0) {
      return res.status(404).json({ message: "No shifts found" });
    }

    res.status(200).json(allShifts);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getShiftById = async (req, res) => {
  try {
    const id = req.params.id;
    const shift = new Shift(id);
    const shiftData = await shift.getById();

    if (!shiftData) {
      return res.status(404).json({ message: `Shift with ID ${id} not found` });
    }

    res.status(200).json(shiftData);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const updateShift = async (req, res) => {
  try {
    const id = req.params.id;
    const shiftData = req.body;

    const shift = createShiftFromData(shiftData, id);

    const idCheck = await shift.getById();
    if (!idCheck) {
      return res
        .status(404)
        .json({ error: `Shift with ID ${id} does not exist` });
    }

    const result = await shift.update();
    res.status(200).json({
      message: "Shift updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const deleteShift = async (req, res) => {
  try {
    const id = req.params.id;
    const shift = new Shift(id);
    const shiftData = await shift.getById();

    if (!shiftData) {
      return res.status(404).json({ message: `Shift with ID ${id} not found` });
    }

    const result = await shift.delete();
    res.status(200).json({
      message: "Shift deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

module.exports = {
  addShift,
  getAllShifts,
  getShiftById,
  updateShift,
  deleteShift,
};
