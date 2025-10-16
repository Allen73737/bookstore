// index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Import routes
const adminAuthRoutes = require("./routes/adminAuth");
const userAuthRoutes = require("./routes/userAuth");
const booksRoutes = require("./routes/books");
// const userDashboardRoutes = require("./routes/userDashboard");

// Use routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/users", userAuthRoutes);
app.use("/api/admin/books", booksRoutes);
// app.use("/api/user", userDashboardRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const cartRoutes = require("./routes/cart");
const authMiddleware = require("./middlewares/authMiddleware"); // your auth to set req.user

app.use("/api/user/cart", authMiddleware, cartRoutes);
