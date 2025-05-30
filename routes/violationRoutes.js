const express = require("express");
const router = express.Router();

const {
  addViolation,
  updateViolation,
  getAllViolations,
  getViolationById,
  deleteViolation,
  returnAllViolations,
} = require("../controllers/violationController");

const {
  returnAllViolationRecords,
} = require("../controllers/violationsEmployeeRecordController.js");

const { validateFields } = require("../middlewares/validateFields");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { checkRoles } = require("../middlewares/authorizeRoles.js");

router.get(
  "/management",
  verifyToken,
  checkRoles("hr", "admin"),
  async (req, res) => {
    try {
      const violations = await returnAllViolations();
      const records = await returnAllViolationRecords();

      res.render("violation", { violations, records });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post(
  "/create",
  verifyToken,
  checkRoles("hr", "admin"),
  validateFields(["updated_by"]),
  addViolation
);

router.patch(
  "/update/:id",
  verifyToken,
  checkRoles("hr", "admin"),
  validateFields(["updated_by"]),
  updateViolation
);

router.get("/all", verifyToken, checkRoles("hr", "admin"), getAllViolations);

router.get("/:id", verifyToken, checkRoles("hr", "admin"), getViolationById);

router.delete(
  "/delete/:id",
  verifyToken,
  checkRoles("hr", "admin"),
  deleteViolation
);

module.exports = router;
