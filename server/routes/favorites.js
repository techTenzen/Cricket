const express = require('express');
const Favorite = require('../models/Favorite');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get user favorites
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate('product');
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to favorites
router.post('/', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const favorite = new Favorite({ user: req.user._id, product: productId });
    await favorite.save();
    res.json({ message: 'Added to favorites' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already in favorites' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Remove from favorites
router.delete('/:productId', auth, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ user: req.user._id, product: req.params.productId });
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;