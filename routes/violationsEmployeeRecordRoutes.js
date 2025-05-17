const express = require("express");
const router = express.Router();

const {
  addViolationRecord,
  updateViolationRecord,
  getAllViolationRecords,
  getViolationRecordById,
  deleteViolationRecord,
} = require("../controllers/violationsEmployeeRecordController");

const { validateFields } = require("../middlewares/validateFields");

router.post("/create", validateFields(["reason"]), addViolationRecord);

router.patch("/update/:id", validateFields(["reason"]), updateViolationRecord);

router.get("/all", getAllViolationRecords);

router.get("/:id", getViolationRecordById);

router.delete("/delete/:id", deleteViolationRecord);

module.exports = router;
