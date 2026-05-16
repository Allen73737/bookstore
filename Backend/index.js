// index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware to expose io to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

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
const userDashboardRoutes = require("./routes/userDashboard");

// Use routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/users", userAuthRoutes);
app.use("/api/admin/books", booksRoutes);
app.use("/api/user", userDashboardRoutes);

// Serve Frontend in Production
app.use(express.static(path.join(__dirname, "../ecommerce_bookstore/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../ecommerce_bookstore/dist/index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const cartRoutes = require("./routes/cart");
const authMiddleware = require("./middlewares/authMiddleware"); // your auth to set req.user

app.use("/api/user/cart", authMiddleware, cartRoutes);
