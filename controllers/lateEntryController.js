const LateEntry = require("../models/LateEntriesModel.js");
const { createLateEntryFromData } = require("../factories/lateEntryFactory");
const { handleControllerError } = require("../utils/controllerErrorHandler.js");
const {
  createViolationRecordFromData,
} = require("../factories/violationsEmployeeRecordFactory");

const addLateEntry = async (req, res) => {
  try {
    const entryData = req.body;
    const lateEntry = createLateEntryFromData(entryData);

    const result = await lateEntry.create();

    const unlinkedLates = await LateEntry.getUnlinkedLateEntries(
      entryData.employee_id
    );

    if (unlinkedLates.length === 2) {
      const violationRecord = createViolationRecordFromData({
        reported_by: entryData.created_by,
        offender_id: entryData.employee_id,
        violation_id: 19,
        reason: "2 rejected late entries in the last 30 days",
        reason_type: "lateness",
      });
      await violationRecord.create();

      const lateIds = unlinkedLates.map((row) => row.id);
      await LateEntry.markAsLinked(lateIds);
    }

    res.status(201).json({
      message: "Late entry record created successfully",
      lateEntryId: result.insertId,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getAllLateEntries = async (req, res) => {
  try {
    const lateEntry = new LateEntry();
    const entries = await lateEntry.getAll();

    if (entries.length === 0) {
      return res.status(404).json({ message: "No late entry records found" });
    }

    res.status(200).json(entries);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getLateEntryById = async (req, res) => {
  try {
    const id = req.params.id;
    const lateEntry = new LateEntry(id);
    const entry = await lateEntry.getById();

    if (!entry) {
      return res
        .status(404)
        .json({ message: `Late entry with ID ${id} not found` });
    }

    res.status(200).json(entry);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const updateLateEntry = async (req, res) => {
  try {
    const id = req.params.id;
    const entryData = req.body;

    const lateEntry = createLateEntryFromData(entryData, id);
    const existing = await lateEntry.getById();

    if (!existing) {
      return res
        .status(404)
        .json({ error: `Late entry with ID ${id} does not exist` });
    }

    const result = await lateEntry.update();

    res.status(200).json({
      message: "Late entry updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const deleteLateEntry = async (req, res) => {
  try {
    const id = req.params.id;
    const lateEntry = new LateEntry(id);
    const existing = await lateEntry.getById();

    if (!existing) {
      return res
        .status(404)
        .json({ error: `Late entry with ID ${id} not found` });
    }

    const result = await lateEntry.delete();

    res.status(200).json({
      message: "Late entry deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

module.exports = {
  addLateEntry,
  getAllLateEntries,
  getLateEntryById,
  updateLateEntry,
  deleteLateEntry,
};
