const LateEntry = require("../models/LateEntriesModel");
const ViolationsEmployeeRecord = require("../models/ViolationsEmployeeRecord");
const { createLateEntryFromData } = require("../factories/lateEntryFactory");
const {
  createViolationRecordFromData,
} = require("../factories/violationsEmployeeRecordFactory");
const { handleControllerError } = require("../utils/controllerErrorHandler");
const { notifyIfStatusChanged } = require("../utils/violationEmails");
const { validateActiveEmployee } = require("../helper/employeeStatusChecker");
const User = require("../models/UserModel");

const addLateEntry = async (req, res) => {
  try {
    const entryData = req.body;
    const userId = req.user.id;
    const user = new User({ id: userId });
    const userData = await user.getById();
    entryData.created_by = userData.employee_id;
    const lateEntry = createLateEntryFromData(entryData);

    await validateActiveEmployee(entryData.employee_id);

    const result = await lateEntry.create();

    const unlinkedLates = await LateEntry.getUnlinkedLateEntries(
      entryData.employee_id
    );

    let emailStatus = "No violation triggered";

    if (unlinkedLates.length === 2) {
      const violationRecord = createViolationRecordFromData({
        reported_by: entryData.created_by,
        offender_id: entryData.employee_id,
        violation_id: 19,
        reason: "2 rejected late entries in the last 30 days",
        reason_type: "lateness",
      });

      const previousWeight =
        await ViolationsEmployeeRecord.getEmployeeTotalViolationWeight(
          entryData.employee_id
        );
      const verResult = await violationRecord.create();

      const lateIds = unlinkedLates.map((row) => row.id);
      await LateEntry.markAsLinkedWithViolation(lateIds, verResult.insertId);

      const notifyResult = await notifyIfStatusChanged(
        entryData.employee_id,
        previousWeight
      );
      emailStatus = notifyResult.message;
    }

    res.status(201).json({
      message: "Late entry record created successfully",
      lateEntryId: result.insertId,
      emailStatus,
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
    const data = req.body;
    const lateEntry = new createLateEntryFromData(data, id);

    const existing = await lateEntry.getById();
    if (!existing) {
      return res
        .status(404)
        .json({ error: `Late entry with ID ${id} not found` });
    }

    const wasRejected = existing.excuse === "rejected";
    const willBeRejected = data.excuse === "rejected";

    const result = await lateEntry.update();

    let emailStatus = "No violation triggered";

    if (wasRejected && !willBeRejected) {
      if (existing.violation_linked) {
        await LateEntry.unlinkLateEntryByViolation(
          existing.violation_record_id
        );

        const countForThisVER =
          await LateEntry.countRejectedLinkedLateEntriesByViolation(
            existing.violation_record_id
          );
        if (countForThisVER < 2) {
          const violation = new ViolationsEmployeeRecord(
            existing.violation_record_id
          );
          await violation.delete();
        }
      }
    } else if (!wasRejected && willBeRejected) {
      const unlinkedLates = await LateEntry.getUnlinkedLateEntries(
        data.employee_id
      );
      if (unlinkedLates.length === 2) {
        const violationRecord = createViolationRecordFromData({
          reported_by: 39,
          offender_id: data.employee_id,
          violation_id: 19,
          reason: "2 rejected late entries in the last 30 days",
          reason_type: "lateness",
        });

        const previousWeight =
          await ViolationsEmployeeRecord.getEmployeeTotalViolationWeight(
            data.employee_id
          );
        const verResult = await violationRecord.create();

        const lateIds = unlinkedLates.map((row) => row.id);
        await LateEntry.markAsLinkedWithViolation(lateIds, verResult.insertId);

        const notifyResult = await notifyIfStatusChanged(
          data.employee_id,
          previousWeight
        );
        emailStatus = notifyResult.message;
      }
    }

    res.status(200).json({
      message: "Late entry updated successfully",
      affectedRows: result.affectedRows,
      emailStatus,
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

    const violationRecordId = existing.violation_record_id;

    const result = await lateEntry.delete();

    if (violationRecordId) {
      const ver = new ViolationsEmployeeRecord(violationRecordId);
      await ver.delete();

      await LateEntry.unlinkLateEntryByViolation(violationRecordId);

      const unlinkedLates = await LateEntry.getUnlinkedLateEntries(
        existing.employee_id
      );
      if (unlinkedLates.length === 2) {
        const violationRecord = createViolationRecordFromData({
          reported_by: 39,
          offender_id: existing.employee_id,
          violation_id: 19,
          reason: "2 rejected late entries in the last 30 days",
          reason_type: "lateness",
        });
        const verResult = await violationRecord.create();
        const lateIds = unlinkedLates.map((row) => row.id);
        await LateEntry.markAsLinkedWithViolation(lateIds, verResult.insertId);
      }
    }

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
