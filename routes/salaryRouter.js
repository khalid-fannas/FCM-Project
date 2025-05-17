const express = require("express");

const router = express.Router();

const { validateFields } = require("../middlewares/validateFields.js");

const {
  addSalary,
  updateSalary,
  getAllSalaries,
  getSalaryById,
  deleteSalary,
} = require("../controllers/salaryController.js");

router.get("/all", getAllSalaries);

router.get("/:id", getSalaryById);

router.post("/create", validateFields(), addSalary);

router.patch("/update/:id", validateFields(), updateSalary);

router.delete("/delete/:id", deleteSalary);

module.exports = router;
