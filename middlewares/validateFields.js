const validateFields = (excludedFields = []) => {
  return (req, res, next) => {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No data provided" });
    }

    const invalidFields = Object.keys(data).filter(
      (field) =>
        !excludedFields.includes(field) &&
        (data[field] === undefined ||
          data[field] === null ||
          data[field] === "")
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        error: `Invalid or empty fields: ${invalidFields.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = { validateFields };
