const express = require("express");
const router = express.Router();
const {
  checkoutItem,
  returnItem,
  getUserTransactions,
} = require("../controllers/transactionController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.post("/checkout", authenticateToken, checkoutItem);

router.post("/return/:id", authenticateToken, returnItem);

router.get("/user/:userId", authenticateToken, getUserTransactions);

module.exports = router;
