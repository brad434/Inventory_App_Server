const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  admin: { type: Boolean, default: false },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

//create the model from the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
