const express = require("express");

const router = express.Router();

const { validateFields } = require("../middlewares/validateFields.js");

const {
  addShift,
  updateShift,
  getAllShifts,
  getShiftById,
  deleteShift,
} = require("../controllers/shiftsController.js");

router.get("/all", getAllShifts);

router.get("/:id", getShiftById);

router.post("/create", validateFields(), addShift);

router.patch("/update/:id", validateFields(), updateShift);

router.delete("/delete/:id", deleteShift);

module.exports = router;
