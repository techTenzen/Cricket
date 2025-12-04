const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  category: { 
    type: String, 
    required: true,
    enum: ['bats', 'balls', 'pads', 'gloves', 'helmets', 'shoes', 'clothing', 'accessories', 'stumps']
  },
  brand: { type: String, required: true },
  modelRange: { type: String },
  images: [{ type: String }],
  primaryImageIndex: { type: Number, default: 0 },
  hoverImageIndex: { type: Number, default: 1 },
  stock: { type: Number, required: true, default: 0 },
  sizeVariants: [{
    size: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 }
  }],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  features: [{ type: String }],
  specifications: {
    weight: String,
    material: String,
    size: String,
    color: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);