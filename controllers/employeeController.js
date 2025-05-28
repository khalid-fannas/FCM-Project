const { createEmployeeFromData } = require("../factories/employeeFactory.js");
const { handleControllerError } = require("../utils/controllerErrorHandler.js");
const Employee = require("../models/EmployeeModel.js");

const addEmployee = async (req, res) => {
  try {
    const employeeData = req.body;
    const employee = createEmployeeFromData(employeeData);

    const emailExists = await employee.checkEmail();
    if (emailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const result = await employee.create();
    res.status(201).json({
      message: "Employee created successfully",
      employeeId: result.insertId,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employee = new Employee();

    const allEmployees = await employee.getall();

    res.status(200).json(allEmployees);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getAllActiveEmployees = async (req, res) => {
  try {
    const employee = new Employee();

    const allEmployees = await employee.getallActiveEmployees();
    res.status(200).json(allEmployees);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const id = req.params.id;

    const employee = new Employee(id);
    const employeeData = await employee.getById();
    if (!employeeData) {
      return res
        .status(404)
        .json({ message: `Employee with ID ${id} not found` });
    }
    res.status(200).json(employeeData);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const updateEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const employeeData = req.body;

    const employee = createEmployeeFromData(employeeData, id);

    const idCheck = await employee.getById();
    if (!idCheck) {
      return res
        .status(400)
        .json({ error: `Employee with ID ${id} does not exist` });
    }

    const result = await employee.update();
    res.status(201).json({
      message: "Employee updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;

    const employee = new Employee(id);
    const employeeData = await employee.getById();
    if (!employeeData) {
      return res
        .status(404)
        .json({ message: `Employee with ID ${id} not found` });
    }

    const result = await employee.delete();
    res.status(200).json({
      message: "Employee now is InActive",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

module.exports = {
  addEmployee,
  updateEmployee,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
  getAllActiveEmployees,
};
