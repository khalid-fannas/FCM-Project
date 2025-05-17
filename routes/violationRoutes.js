const express = require("express");
const router = express.Router();

const {
  addViolation,
  updateViolation,
  getAllViolations,
  getViolationById,
  deleteViolation,
} = require("../controllers/violationController");

const { validateFields } = require("../middlewares/validateFields");

router.post("/create", validateFields(["updated_by"]), addViolation);

router.patch("/update/:id", validateFields(["updated_by"]), updateViolation);

router.get("/all", getAllViolations);

router.get("/:id", getViolationById);

router.delete("/delete/:id", deleteViolation);

module.exports = router;
