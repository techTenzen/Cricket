const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/new-arrivals - Get new arrival products
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const newArrivals = await Product.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name price oldPrice images category brand rating numReviews stock');
    
    res.json(newArrivals);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;