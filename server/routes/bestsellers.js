const express = require('express');
const Product = require('../models/Product');
const BestSeller = require('../models/BestSeller');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get best selling products for public
router.get('/', async (req, res) => {
  try {
    const bestSellers = await BestSeller.find()
      .populate('product')
      .sort({ order: 1, createdAt: -1 })
      .limit(8);
    
    const products = bestSellers.map(bs => bs.product).filter(p => p);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;