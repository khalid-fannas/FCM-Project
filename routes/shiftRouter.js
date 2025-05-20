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

const { verifyToken } = require("../middlewares/authMiddleware.js");
const { checkRoles } = require("../middlewares/authorizeRoles.js");

router.get("/all", verifyToken, checkRoles("hr , admin"), getAllShifts);

router.get("/:id", verifyToken, checkRoles("hr , admin"), getShiftById);

router.post(
  "/create",
  verifyToken,
  checkRoles("hr , admin"),
  validateFields(),
  addShift
);

router.patch(
  "/update/:id",
  verifyToken,
  checkRoles("hr , admin"),
  validateFields(),
  updateShift
);

router.delete(
  "/delete/:id",
  verifyToken,
  checkRoles("hr , admin"),
  deleteShift
);

module.exports = router;
