const multer = require("multer");

function multerErrorHandler(err, req, res, next) {
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res
      .status(400)
      .json({ error: "Only one file can be uploaded at a time" });
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File size exceeds the limit" });
  }
  if (
    err instanceof multer.MulterError ||
    err.message === "Only PDF files are allowed"
  ) {
    return res.status(400).json({ error: err.message });
  }

  next(err);
}

module.exports = multerErrorHandler;
