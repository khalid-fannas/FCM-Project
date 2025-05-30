const jwt = require("jsonwebtoken");

const verifyResetCookie = (req, res, next) => {
  const token = req.cookies.reset_token;

  if (!token) {
    return res.status(401).json({ message: "No reset token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== "password_reset") {
      return res.status(403).json({ message: "Invalid token purpose" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const verifyToken = (req, res, next) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  if (!accessToken) {
    return res.redirect("/api/auth/login");
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        if (!refreshToken) {
          console.log("No refresh token, redirecting to login");
          return res.redirect("/api/auth/login");
        }

        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (refreshErr, refreshDecoded) => {
            if (refreshErr) {
              console.log("Invalid refresh token, redirecting to login");
              return res.redirect("/api/auth/login");
            }

            const newAccessToken = jwt.sign(
              { id: refreshDecoded.id, role: refreshDecoded.role },
              process.env.JWT_SECRET,
              { expiresIn: "15m" }
            );

            res.cookie("access_token", newAccessToken, {
              httpOnly: true,
              sameSite: "Strict",
              secure: process.env.NODE_ENV === "production",
            });

            req.user = { id: refreshDecoded.id, role: refreshDecoded.role };
            res.locals.role = refreshDecoded.role.toLowerCase();
            next();
          }
        );
      } else {
        console.log("Invalid access token, redirecting to login");
        return res.redirect("/api/auth/login");
      }
    } else {
      req.user = decoded;
      res.locals.role = decoded.role.toLowerCase();
      next();
    }
  });
};

module.exports = {
  verifyResetCookie,
  verifyToken,
};
