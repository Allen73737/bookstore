const express = require('express');
const router = express.Router();

// In-memory blacklist store - use Redis or DB for production
const tokenBlacklist = new Set();

router.post('/', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(400).json({ message: "No token provided" });
  const token = authHeader.split(' ')[1];
  tokenBlacklist.add(token);
  res.json({ message: "Logged out successfully" });
});

module.exports = { router, tokenBlacklist };
