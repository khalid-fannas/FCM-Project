const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024,
};

const uploadPdf = multer({ storage, fileFilter, limits });

module.exports = uploadPdf;
