const express = require("express");
const Router = express.Router();
const {
  addItem,
  getAllItems,
  getItemById,
  getItemsByCategory,
  updateItemQuantity,
  deleteItem,
} = require("../controllers/inventoryController.js");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware.js");

Router.get("/", getAllItems);
Router.get("/id", getItemById);
Router.get("/category/:category", getItemsByCategory);

Router.post("/add", authenticateToken, requireAdmin, addItem);
Router.put("/:id/update", authenticateToken, requireAdmin, updateItemQuantity);
Router.delete("/:id", authenticateToken, requireAdmin, deleteItem);

module.exports = Router;
