const express = require("express");
const Router = express.Router();
const {
  getAllUsers,
  register,
  login,
  createUser,
  deleteUser,
} = require("../controllers/userController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

Router.get("/", getAllUsers);
Router.post("/register", register);
Router.post("/login", login);
Router.delete("/delete/:id", authenticateToken, requireAdmin, deleteUser);
Router.post("/create-user", authenticateToken, requireAdmin, createUser);

module.exports = Router;
