const PORT = process.env.PORT || 5000;
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
require("dotenv").config();

const app = express();
app.use(
  cors({
    //origin: "http://localhost:5173", // Replace with your frontend URL
    origin: "https://inventory-app-mauve-five.vercel.app/" || "*",
    credentials: true,
  })
);
app.use(express.json());

// const categoriesData = {
//   Computer_Hardware: ["CPU", "GPU", "Motherboard", "RAM"],
//   Drones: ["DJI Phantom", "Parrot Anafi", "Mavic Mini"],
//   Science: ["Microscope", "Telescope", "Lab Kit"],
//   "3D_Printing": ["PLA Filament", "ABS Filament", "3D Printer"],
//   Marketing: ["SEO Tools", "Marketing Books", "Analytics Software"],
// };

app.get("/", (req, res) => {
  res.send("Inventory App Backend!");
});

app.use("/users", userRoutes);
app.use("/inventory", inventoryRoutes);
// app.use("/category/:category", inventoryRoutes);
app.use("/transactions", transactionRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
