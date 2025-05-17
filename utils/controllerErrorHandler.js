const { isDatabaseError, handleDatabaseError } = require("./dbErrorHandler");

function handleControllerError(err, res) {
  console.error(err);

  if (isDatabaseError(err)) {
    const handled = handleDatabaseError(err);
    return res.status(handled.status).json({ error: handled.message });
  }

  if (err.message) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: "An unexpected error occurred" });
}

module.exports = { handleControllerError };
