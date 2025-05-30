const ViolationsEmployeeRecord = require("../models/ViolationsEmployeeRecord");
const {
  createViolationRecordFromData,
} = require("../factories/violationsEmployeeRecordFactory");
const { handleControllerError } = require("../utils/controllerErrorHandler");
const Employee = require("../models/EmployeeModel.js");
const { notifyIfStatusChanged } = require("../utils/violationEmails.js");
const {
  validateActiveEmployee,
} = require("../helper/employeeStatusChecker.js");
const { updateEmployeeStatus } = require("../helper/updateEmployeeStatus.js");
const User = require("../models/UserModel");

const addViolationRecord = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user.id;
    const user = new User({ id: userId });
    const userData = await user.getById();
    data.reported_by = userData.employee_id;

    const record = createViolationRecordFromData(data);

    const employeeId = data.offender_id;

    await validateActiveEmployee(employeeId);

    const previousWeight =
      await ViolationsEmployeeRecord.getEmployeeTotalViolationWeight(
        employeeId
      );

    const result = await record.create();

    const notifyResult = await notifyIfStatusChanged(
      employeeId,
      previousWeight
    );

    res.status(201).json({
      message: "Violation record created successfully",
      violationRecordId: result.insertId,
      emailStatus: notifyResult.message,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getAllViolationRecords = async (req, res) => {
  try {
    const record = new ViolationsEmployeeRecord();
    const violationRecord = await record.getAll();
    res.status(200).json(violationRecord);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const returnAllViolationRecords = async (req, res) => {
  try {
    const record = new ViolationsEmployeeRecord();
    return await record.getAll();
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

    const employeeId = existing.offender_id;

    const previousWeight =
      await ViolationsEmployeeRecord.getEmployeeTotalViolationWeight(
        employeeId
      );

    const result = await record.update();

    await updateEmployeeStatus(employeeId);
    const notifyResult = await notifyIfStatusChanged(
      employeeId,
      previousWeight
    );

    res.status(200).json({
      message: "Violation record updated successfully",
      affectedRows: result.affectedRows,
      emailStatus: notifyResult.message,
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

    const employeeId = existing.offender_id;

    const result = await record.delete();

    await updateEmployeeStatus(employeeId);

    res.status(200).json({
      message: "Violation record deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getEmployeeStatus = async (req, res) => {
  try {
    const employeeId = req.params.id;

    const employee = new Employee(employeeId);
    const employeeData = await employee.getById();
    if (!employeeData) {
      return res
        .status(404)
        .json({ message: `Employee with ID ${employeeId} not found` });
    }

    const totalWeight =
      await ViolationsEmployeeRecord.getEmployeeTotalViolationWeight(
        employeeId
      );

    let status = "Clean Record";
    if (totalWeight >= 3) status = "Termination Risk";
    else if (totalWeight >= 2) status = "Final Warning";
    else if (totalWeight >= 1) status = "First Warning";
    else if (totalWeight >= 0.5) status = "Verbal Warning";

    res.status(200).json({
      employeeId,
      totalWeight,
      status,
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
  getEmployeeStatus,
  returnAllViolationRecords,
};
