const express = require("express");
const router = express.Router();
const User = require("../models/Cart"); // your User model file path

// Middleware: add an auth middleware that sets req.user.userId for authenticated user

// Get user's cart items with populated book details
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("cart.bookId");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add book to cart or increase qty
router.post("/:bookId?", async (req, res) => {
  const bookId = req.params.bookId || req.body.bookId;
  const quantity = req.body.quantity || req.body.qty || 1;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let item = user.cart.find((i) => i.bookId.equals(bookId));
    if (item) {
      item.quantity += quantity || 1;
    } else {
      user.cart.push({ bookId, quantity: quantity || 1 });
    }
    await user.save();
    await user.populate("cart.bookId");
    if (req.io) req.io.emit('cartUpdated');
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update quantity in cart for specific book
router.patch("/:bookId", async (req, res) => {
  const quantity = req.body.quantity || req.body.qty;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let item = user.cart.find((i) => i.bookId.equals(req.params.bookId));
    if (!item) return res.status(404).json({ message: "Book not in cart" });

    item.quantity = quantity;
    await user.save();
    await user.populate("cart.bookId");
    if (req.io) req.io.emit('cartUpdated');
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove book from cart
router.delete("/:bookId", async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter((i) => !i.bookId.equals(req.params.bookId));
    await user.save();
    await user.populate("cart.bookId");
    if (req.io) req.io.emit('cartUpdated');
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Reserve or preorder a book
router.post("/:bookId/reserve", async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // You could flag reservation here; for demo, just return success
    // Example: store reserved flag in a separate field or collection if needed

    // For demo:
    res.json({ message: "Reserved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
