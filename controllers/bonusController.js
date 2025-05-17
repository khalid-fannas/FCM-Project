const Bonus = require("../models/BonusModel");
const { handleControllerError } = require("../utils/controllerErrorHandler");
const { createBonusFromData } = require("../factories/bonusFactory");

const addBonus = async (req, res) => {
  try {
    const bonusData = req.body;
    const bonus = createBonusFromData(bonusData);

    const result = await bonus.create();
    res.status(201).json({
      message: "Bonus record created successfully",
      bonusId: result.insertId,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getAllBonuses = async (req, res) => {
  try {
    const bonus = new Bonus();
    const allBonuses = await bonus.getAll();

    if (allBonuses.length === 0) {
      return res.status(404).json({ message: "No bonus records found" });
    }

    res.status(200).json(allBonuses);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const getBonusById = async (req, res) => {
  try {
    const id = req.params.id;
    const bonus = new Bonus(id);

    const bonusData = await bonus.getById();
    if (!bonusData) {
      return res
        .status(404)
        .json({ message: `Bonus record with ID ${id} not found` });
    }

    res.status(200).json(bonusData);
  } catch (err) {
    handleControllerError(err, res);
  }
};

const updateBonus = async (req, res) => {
  try {
    const id = req.params.id;
    const bonusData = req.body;

    const bonus = createBonusFromData(bonusData, id);
    const existingBonus = await bonus.getById();

    if (!existingBonus) {
      return res
        .status(404)
        .json({ error: `Bonus record with ID ${id} does not exist` });
    }

    const result = await bonus.update();
    res.status(200).json({
      message: "Bonus record updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

const deleteBonus = async (req, res) => {
  try {
    const id = req.params.id;
    const bonus = new Bonus(id);

    const existingBonus = await bonus.getById();
    if (!existingBonus) {
      return res
        .status(404)
        .json({ message: `Bonus record with ID ${id} not found` });
    }

    const result = await bonus.delete();
    res.status(200).json({
      message: "Bonus record deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    handleControllerError(err, res);
  }
};

module.exports = {
  addBonus,
  getAllBonuses,
  getBonusById,
  updateBonus,
  deleteBonus,
};
