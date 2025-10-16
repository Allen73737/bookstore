const express = require('express');
const Admin = require('../models/Admin');
const { comparePassword, generateToken } = require('../utils/auth');

const router = express.Router();

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const match = await comparePassword(password, admin.passwordHash);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken({ adminId: admin._id });
    res.json({ success: true, token });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
