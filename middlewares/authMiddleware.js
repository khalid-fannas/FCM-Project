const jwt = require("jsonwebtoken");

const verifyResetCookie = (req, res, next) => {
  const token = req.cookies.reset_token;

  if (!token) {
    return res.status(401).json({ error: "No reset token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== "password_reset") {
      return res.status(403).json({ error: "Invalid token purpose" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        } else {
          return res.status(401).json({ message: "Invalid token" });
        }
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Token authentication error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  verifyResetCookie,
  verifyToken,
};
