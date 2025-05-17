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

router.post(
  "/create",
  validateFields(["excuse", "updated_by", "reason"]),
  addLateEntry
);

router.patch(
  "/update/:id",
  validateFields(["excuse", "updated_by", "reason"]),
  updateLateEntry
);

router.get("/all", getAllLateEntries);

router.get("/:id", getLateEntryById);

router.delete("/delete/:id", deleteLateEntry);

module.exports = router;
