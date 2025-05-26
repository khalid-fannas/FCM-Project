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
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { checkRoles } = require("../middlewares/authorizeRoles.js");

router.get("/all", verifyToken, checkRoles("hr", "admin"), getAllEmployees);

router.get("/:id", verifyToken, checkRoles("hr", "admin"), getEmployeeById);

router.post(
  "/create",
  verifyToken,
  checkRoles("hr", "admin"),
  validateFields(),
  addEmployee
);

router.patch(
  "/update/:id",
  verifyToken,
  checkRoles("hr", "admin"),
  validateFields(),
  updateEmployee
);

router.delete(
  "/delete/:id",
  verifyToken,
  checkRoles("hr", "admin"),
  deleteEmployee
);

module.exports = router;
