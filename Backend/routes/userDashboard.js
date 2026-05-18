const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// GET /api/user/profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/user/favorites
router.get('/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('favorites');
    res.json(user.favorites || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/user/favorites/:bookId
router.post('/favorites/:bookId', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const bookId = req.params.bookId;
    const isFavorited = user.favorites.some(id => id.toString() === bookId);

    if (isFavorited) {
      user.favorites = user.favorites.filter(id => id.toString() !== bookId);
    } else {
      user.favorites.push(bookId);
    }

    await user.save();
    
    // Emit socket event to update the dashboard in real-time
    if (req.io) {
      req.io.emit('favoritesUpdated');
    }

    res.json({ success: true, isFavorited: !isFavorited });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/user/recent-books
router.get('/recent-books', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('recentBooks');
    res.json(user.recentBooks || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
