const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }

    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      req.user = user; // attach user to request object
      next();
    } catch (error) {
      res.status(500).json({ message: "Failed to authenticate user." });
    }
  });
};

const requireAdmin = (req, res, next) => {
  if (!req.user.admin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { authenticateToken, requireAdmin };
