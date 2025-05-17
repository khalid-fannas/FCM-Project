const express = require("express");
const router = express.Router();

const {
  addDeduction,
  updateDeduction,
  getAllDeductions,
  getDeductionById,
  deleteDeduction,
} = require("../controllers/deductionController");

const { validateFields } = require("../middlewares/validateFields");

router.post("/create", validateFields(["reason"]), addDeduction);

router.patch("/update/:id", validateFields(["reason"]), updateDeduction);

router.get("/all", getAllDeductions);

router.get("/:id", getDeductionById);

router.delete("/delete/:id", deleteDeduction);

module.exports = router;
