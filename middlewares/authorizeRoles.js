const User = require("../models/UserModel");

const checkRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    const user = req.user;

    if (!user || !user.role) {
      return res.status(401).json({ error: "Unauthorized: No role found" });
    }

    const role = user.role.toLowerCase();

    if (role === "super_admin") {
      return next();
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }

    if (role === "admin" && req.body && req.body.role) {
      const newAssignedRole = req.body.role.toLowerCase();

      if (newAssignedRole === "admin" || newAssignedRole === "super_admin") {
        return res.status(403).json({
          error: "Admins cannot assign admin or super_admin roles",
        });
      }

      if (req.params.id) {
        const userId = parseInt(req.params.id, 10);
        const user = new User({ id: userId });
        const targetUser = await user.getById();

        if (!targetUser) {
          return res.status(404).json({ error: "User not found" });
        }

        const targetUserRole = targetUser.role.toLowerCase();
        if (targetUserRole === "admin" || targetUserRole === "super_admin") {
          return res.status(403).json({
            error: "Admins cannot modify users with admin or super_admin roles",
          });
        }
      }
    }

    next();
  };
};

module.exports = { checkRoles };
