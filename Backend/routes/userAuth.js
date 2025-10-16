const express = require('express');
const User = require('../models/User');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

const router = express.Router();

// POST /api/users/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const passwordHash = await hashPassword(password);
    const user = new User({ name, email, passwordHash });
    await user.save();
    const token = generateToken({ userId: user._id });
    res.json({ success: true, token });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await comparePassword(password, user.passwordHash);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = generateToken({ userId: user._id });
    res.json({ success: true, token });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
