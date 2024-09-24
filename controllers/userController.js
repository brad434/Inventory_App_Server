const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  const userEmail = email.toLowerCase();
  try {
    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: userEmail,
      password: hashedPassword,
      name,
      admin: isAdmin || false,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user." });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

exports.register = async (req, res) => {
  const { name, email, password, admin } = req.body;
  const userEmail = email.toLowerCase();

  try {
    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: userEmail,
      password: hashedPassword,
      admin: admin || false,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const userEmail = email.toLowerCase();

  try {
    const user = await User.findOne({
      email: userEmail,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Email or Password." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.admin },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Logged in successfully",
      token,
      user: { email: user.email, admin: user.admin },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getUserTransactions = async (req, res) => {
  try {
    const userTransactions = await User.findById(req.params.userId)
      .populate("transactions")
      .exec();
    res.json(userTransactions.transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve user transactions" });
  }
};

exports.updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { password: hashedPassword },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update password." });
  }
};

exports.getUserInventory = async (req, res) => {
  try {
    const userInventory = await User.findById(req.params.userId)
      .populate("inventory")
      .exec();
    res.json(userInventory.inventory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve user inventory" });
  }
};

exports.updateUserInventory = async (req, res) => {
  try {
    const updatedInventory = await User.findByIdAndUpdate(
      req.params.userId,
      { $push: { inventory: req.body } },
      { new: true }
    ).populate("inventory");
    res.json(updatedInventory.inventory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update user inventory" });
  }
};

exports.deleteUserInventory = async (req, res) => {
  try {
    const updatedInventory = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { inventory: req.body } },
      { new: true }
    ).populate("inventory");
    res.json(updatedInventory.inventory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete user inventory item" });
  }
};

exports.updateUserAdminStatus = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { admin: !req.body.admin },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update user admin status" });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const transactions = await Transaction.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    })
      .populate("item")
      .exec();
    // Add additional calculations and filters here to generate report data
    // For example, calculate total sales, average price per item, etc.
    // ...
    // res.json(reportData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};
