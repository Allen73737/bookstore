const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  quantity: { type: Number, default: 1 },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  recentBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  cart: [cartItemSchema], // Include cartItemSchema array as 'cart' field
});

module.exports = mongoose.model('User', userSchema);
