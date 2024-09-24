const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  takenAt: { type: Date, default: Date.now },
  returnedAt: { type: Date },
  status: { type: String, enum: ["Taken", "Returned"], default: "Taken" },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
