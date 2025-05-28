const Salary = require("../models/SalaryModel");
const { handleControllerError } = require("../utils/controllerErrorHandler");
const { createSalaryFromData } = require("../factories/salaryFactory");

const addSalary = async (req, res) => {
  try {
    const salaryData = req.body;

    const salary = createSalaryFromData(salaryData);

    const result = await salary.create();
    res.status(201).json({
      message: "Salary record created successfully",
      salaryId: result.insertId,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getAllSalaries = async (req, res) => {
  try {
    const salary = new Salary();
    const allSalaries = await salary.getAll();
    res.status(200).json(allSalaries);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getSalaryById = async (req, res) => {
  try {
    const id = req.params.id;
    const salary = new Salary(id);

    const salaryData = await salary.getById();
    if (!salaryData) {
      return res
        .status(404)
        .json({ message: `Salary record with ID ${id} not found` });
    }

    res.status(200).json(salaryData);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const updateSalary = async (req, res) => {
  try {
    const id = req.params.id;
    const salaryData = req.body;

    const salary = createSalaryFromData(salaryData, id);

    const idCheck = await salary.getById();
    if (!idCheck) {
      return res
        .status(404)
        .json({ error: `Salary record with ID ${id} does not exist` });
    }

    const result = await salary.update();
    res.status(200).json({
      message: "Salary record updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const deleteSalary = async (req, res) => {
  try {
    const id = req.params.id;
    const salary = new Salary(id);

    const salaryData = await salary.getById();
    if (!salaryData) {
      return res
        .status(404)
        .json({ message: `Salary record with ID ${id} not found` });
    }

    const result = await salary.delete();
    res.status(200).json({
      message: "Salary record deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

module.exports = {
  addSalary,
  getAllSalaries,
  getSalaryById,
  updateSalary,
  deleteSalary,
};
