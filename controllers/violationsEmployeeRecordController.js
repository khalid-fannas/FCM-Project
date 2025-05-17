const ViolationsEmployeeRecord = require("../models/ViolationsEmployeeRecord");
const {
  createViolationRecordFromData,
} = require("../factories/violationsEmployeeRecordFactory");
const { handleControllerError } = require("../utils/controllerErrorHandler");

const addViolationRecord = async (req, res) => {
  try {
    const data = req.body;
    const record = createViolationRecordFromData(data);

    const result = await record.create();
    res.status(201).json({
      message: "Violation record created successfully",
      violationRecordId: result.insertId,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getAllViolationRecords = async (req, res) => {
  try {
    const record = new ViolationsEmployeeRecord();
    const records = await record.getAll();

    if (records.length === 0) {
      return res.status(404).json({ message: "No violation records found" });
    }

    res.status(200).json(records);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getViolationRecordById = async (req, res) => {
  try {
    const id = req.params.id;
    const record = new ViolationsEmployeeRecord(id);

    const data = await record.getById();
    if (!data) {
      return res
        .status(404)
        .json({ message: `Violation record with ID ${id} not found` });
    }

    res.status(200).json(data);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const updateViolationRecord = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const record = createViolationRecordFromData(data, id);
    const existing = await record.getById();

    if (!existing) {
      return res
        .status(404)
        .json({ error: `Violation record with ID ${id} does not exist` });
    }

    const result = await record.update();
    res.status(200).json({
      message: "Violation record updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const deleteViolationRecord = async (req, res) => {
  try {
    const id = req.params.id;
    const record = new ViolationsEmployeeRecord(id);

    const existing = await record.getById();
    if (!existing) {
      return res
        .status(404)
        .json({ message: `Violation record with ID ${id} not found` });
    }

    const result = await record.delete();
    res.status(200).json({
      message: "Violation record deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

module.exports = {
  addViolationRecord,
  getAllViolationRecords,
  getViolationRecordById,
  updateViolationRecord,
  deleteViolationRecord,
};
