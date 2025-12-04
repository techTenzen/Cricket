const express = require('express');
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const BestSeller = require('../models/BestSeller');
const router = express.Router();

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    // Basic counts from MongoDB
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCarts = await Cart.countDocuments();
    
    // Revenue calculation from delivered orders
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Recent orders with user data
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Top products by rating and reviews
    const topProducts = await Product.find({})
      .sort({ rating: -1, numReviews: -1 })
      .limit(5);

    // Category distribution
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Order status distribution
    const orderStatusStats = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Monthly sales data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlySales = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: 'delivered' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Calculate metrics from real data
    const totalVisitors = await User.countDocuments(); // Assuming all users are visitors
    const totalPurchases = await Order.countDocuments({ status: { $in: ['delivered', 'shipped'] } });
    const conversionRate = totalVisitors > 0 ? ((totalPurchases / totalVisitors) * 100).toFixed(1) : 0;
    
    const avgOrderValueData = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, avgValue: { $avg: '$totalAmount' } } }
    ]);
    const avgOrderValue = avgOrderValueData[0]?.avgValue?.toFixed(0) || 0;
    
    // Return rate calculation (assuming cancelled orders as returns)
    const totalDeliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const totalCancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    const returnRate = totalDeliveredOrders > 0 ? ((totalCancelledOrders / totalDeliveredOrders) * 100).toFixed(1) : 0;

    res.json({
      totalUsers,
      totalAdmins,
      totalProducts,
      totalOrders,
      totalCarts,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      topProducts,
      categoryStats,
      orderStatusStats,
      monthlySales,
      conversionRate: parseFloat(conversionRate),
      avgOrderValue: parseFloat(avgOrderValue),
      returnRate: parseFloat(returnRate)
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role
router.put('/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset metrics endpoints
router.post('/reset/revenue', adminAuth, async (req, res) => {
  try {
    await Order.updateMany({}, { totalAmount: 0 });
    res.json({ message: 'Revenue reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/reset/orders', adminAuth, async (req, res) => {
  try {
    await Order.deleteMany({});
    res.json({ message: 'Orders reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/reset/conversion-rate', adminAuth, async (req, res) => {
  try {
    // Reset conversion rate logic (placeholder)
    res.json({ message: 'Conversion rate reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/reset/avg-order-value', adminAuth, async (req, res) => {
  try {
    // Reset average order value logic (placeholder)
    res.json({ message: 'Average order value reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/reset/return-rate', adminAuth, async (req, res) => {
  try {
    // Reset return rate logic (placeholder)
    res.json({ message: 'Return rate reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bestsellers management
router.get('/bestsellers', adminAuth, async (req, res) => {
  try {
    const bestSellers = await BestSeller.find()
      .populate('product')
      .sort({ order: 1, createdAt: -1 });
    res.json(bestSellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/bestsellers', adminAuth, async (req, res) => {
  try {
    const { productId } = req.body;
    const bestSeller = new BestSeller({ product: productId, type: 'manual' });
    await bestSeller.save();
    await bestSeller.populate('product');
    res.json(bestSeller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/bestsellers/:id/order', adminAuth, async (req, res) => {
  try {
    const { order } = req.body;
    const bestSeller = await BestSeller.findByIdAndUpdate(
      req.params.id,
      { order },
      { new: true }
    ).populate('product');
    res.json(bestSeller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/bestsellers/:id', adminAuth, async (req, res) => {
  try {
    await BestSeller.findByIdAndDelete(req.params.id);
    res.json({ message: 'Best seller removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/bestsellers/sync', adminAuth, async (req, res) => {
  try {
    // Remove existing auto bestsellers
    await BestSeller.deleteMany({ type: 'auto' });
    
    // Get top products by rating and reviews
    const topProducts = await Product.find({})
      .sort({ rating: -1, numReviews: -1 })
      .limit(5);
    
    // Create auto bestsellers
    const autoBestSellers = topProducts.map((product, index) => ({
      product: product._id,
      type: 'auto',
      order: index
    }));
    
    await BestSeller.insertMany(autoBestSellers);
    res.json({ message: 'Auto bestsellers synced successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;