const express = require("express");

const router = express.Router();

const { validateFields } = require("../middlewares/validateFields.js");

const {
  addEmployee,
  updateEmployee,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
} = require("../controllers/employeeController");

router.get("/all", getAllEmployees);

router.get("/:id", getEmployeeById);

router.post("/create", validateFields(), addEmployee);

router.patch("/update/:id", validateFields(), updateEmployee);

router.delete("/delete/:id", deleteEmployee);

module.exports = router;
