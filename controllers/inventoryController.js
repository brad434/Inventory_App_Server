const Inventory = require("../models/inventorySchema");

exports.addItem = async (req, res) => {
  try {
    const { itemName, quantity, description, category, image } = req.body;
    const newItem = new Inventory({
      itemName,
      quantity,
      image: image || null,
      description,
      category,
    });
    await newItem.save();
    res.status(200).json({ message: "Item added to inventory", item: newItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding item to inventory" });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal server error." });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }
    res.status(201).json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving item." });
  }
};

exports.getItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const items = await Inventory.find({ category });
    if (items.length === 0) {
      return res
        .status(404)
        .json({ Message: "No items found in this category" });
    }
    res.status(200).json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving items by category." });
  }
};

exports.updateItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found." });
    }
    res
      .status(200)
      .json({ message: "Item quantity updated", item: updatedItem });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found." });
    }
    res.status(204).json({ message: "Item deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete item." });
  }
};
