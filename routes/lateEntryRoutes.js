const express = require("express");
const router = express.Router();

const {
  addLateEntry,
  getAllLateEntries,
  getLateEntryById,
  updateLateEntry,
  deleteLateEntry,
} = require("../controllers/lateEntryController");

const { validateFields } = require("../middlewares/validateFields");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const { checkRoles } = require("../middlewares/authorizeRoles.js");

router.post(
  "/create",
  verifyToken,
  checkRoles("hr", "admin"),
  validateFields(["excuse", "updated_by", "reason"]),
  addLateEntry
);

router.patch(
  "/update/:id",
  verifyToken,
  checkRoles("hr", "admin"),
  validateFields(["excuse", "updated_by", "reason"]),
  updateLateEntry
);

router.get("/all", verifyToken, checkRoles("hr", "admin"), getAllLateEntries);

router.get("/:id", verifyToken, checkRoles("hr", "admin"), getLateEntryById);

router.delete(
  "/delete/:id",
  verifyToken,
  checkRoles("hr", "admin"),
  deleteLateEntry
);

module.exports = router;
