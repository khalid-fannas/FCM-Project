const Deduction = require("../models/DeductionModel");
const { createDeductionFromData } = require("../factories/deductionFactory");
const { handleControllerError } = require("../utils/controllerErrorHandler");

const addDeduction = async (req, res) => {
  try {
    const deduction = createDeductionFromData(req.body);
    const result = await deduction.create();
    res
      .status(201)
      .json({ message: "Deduction created", deductionId: result.insertId });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getAllDeductions = async (req, res) => {
  try {
    const deduction = new Deduction();
    const allDeduction = await deduction.getAll();

    if (allDeduction.length === 0) {
      return res.status(404).json({ message: "No deductions found" });
    }

    res.status(200).json(allDeduction);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getDeductionById = async (req, res) => {
  try {
    const id = req.params.id;
    const deduction = new Deduction(id);
    const deductionData = await deduction.getById();

    if (!deductionData)
      return res
        .status(404)
        .json({ message: `Deduction with ID ${id} not found` });

    res.status(200).json(deductionData);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const updateDeduction = async (req, res) => {
  try {
    const id = req.params.id;
    const deduction = createDeductionFromData(req.body, id);
    const existing = await deduction.getById();

    if (!existing)
      return res
        .status(404)
        .json({ error: `Deduction with ID ${id} does not exist` });

    const result = await deduction.update();
    res.status(200).json({
      message: "Updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const deleteDeduction = async (req, res) => {
  try {
    const id = req.params.id;
    const deduction = new Deduction(id);
    const existing = await deduction.getById();

    if (!existing)
      return res
        .status(404)
        .json({ error: `Deduction with ID ${id} does not exist` });

    const result = await deduction.delete();
    res.status(200).json({
      message: "Deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

module.exports = {
  addDeduction,
  getAllDeductions,
  getDeductionById,
  updateDeduction,
  deleteDeduction,
};
