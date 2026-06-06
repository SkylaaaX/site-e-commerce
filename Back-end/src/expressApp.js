const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const ProduictRoutes = require("./routes/Produits");
const adminProduitRoutes = require("./routes/adminProduits");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/produits", ProduictRoutes);
app.use("/api/admin/produits", adminProduitRoutes);

module.exports = app;
