const express = require("express");

const router = express.Router();

const { validateFields } = require("../middlewares/validateFields.js");

const {
  addEmployee,
  updateEmployee,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
  getAllActiveEmployees,
} = require("../controllers/employeeController");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { checkRoles } = require("../middlewares/authorizeRoles.js");

router.get(
  "/management",
  verifyToken,
  checkRoles("hr", "admin"),
  (req, res) => {
    res.render("employee", { role: req.user.role });
  }
);

router.get(
  "/allActive",
  verifyToken,
  checkRoles("hr", "admin"),
  getAllActiveEmployees
);

router.get(
  "/all",
  verifyToken,
  checkRoles("hr", "admin", "data_entry"),
  getAllEmployees
);

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
