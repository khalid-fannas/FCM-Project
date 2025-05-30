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
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { checkRoles } = require("../middlewares/authorizeRoles.js");

router.get(
  "/management",
  verifyToken,
  checkRoles("hr", "admin"),
  (req, res) => {
    res.render("salary");
  }
);

router.get("/all", verifyToken, checkRoles("hr", "admin"), getAllSalaries);

router.get("/:id", verifyToken, checkRoles("hr", "admin"), getSalaryById);

router.post(
  "/create",
  verifyToken,
  checkRoles("hr", "admin"),
  validateFields(),
  addSalary
);

router.patch(
  "/update/:id",
  verifyToken,
  checkRoles("hr", "admin"),
  validateFields(),
  updateSalary
);

router.delete(
  "/delete/:id",
  verifyToken,
  checkRoles("hr", "admin"),
  deleteSalary
);

module.exports = router;
