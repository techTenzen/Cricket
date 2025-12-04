const express = require('express');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const { validateProduct, validateReview } = require('../middleware/validation');
const { sanitizeInput, validateObjectId } = require('../middleware/security');
const { upload, uploadToS3 } = require('../middleware/upload');

const router = express.Router();

// Upload images to S3
router.post('/upload-images', adminAuth, (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: `Upload failed: ${err.message}` });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    const imageUrls = req.files.map(file => file.location);
    res.json({ images: imageUrls });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: error.message });
  }
});



// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (Admin only)
router.post('/', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Files:', req.files?.length || 0);
    
    const productData = req.body;
    
    // Basic validation
    if (!productData.name || !productData.description || !productData.price || !productData.category || !productData.brand) {
      console.log('Missing fields:', { name: !!productData.name, description: !!productData.description, price: !!productData.price, category: !!productData.category, brand: !!productData.brand });
      return res.status(400).json({ message: 'Missing required fields: name, description, price, category, brand' });
    }
    
    // Parse sizeVariants if it exists
    if (productData.sizeVariants && typeof productData.sizeVariants === 'string') {
      try {
        productData.sizeVariants = JSON.parse(productData.sizeVariants);
      } catch (e) {
        console.error('Failed to parse sizeVariants:', e);
        productData.sizeVariants = [];
      }
    }
    
    // Parse features if it exists
    if (productData.features && typeof productData.features === 'string') {
      try {
        productData.features = JSON.parse(productData.features);
      } catch (e) {
        console.error('Failed to parse features:', e);
        productData.features = [];
      }
    }
    
    // Parse specifications if it exists
    if (productData.specifications && typeof productData.specifications === 'string') {
      try {
        productData.specifications = JSON.parse(productData.specifications);
      } catch (e) {
        console.error('Failed to parse specifications:', e);
        productData.specifications = {};
      }
    }
    
    // Calculate total stock from size variants
    if (productData.sizeVariants && productData.sizeVariants.length > 0) {
      productData.stock = productData.sizeVariants.reduce((total, variant) => total + (variant.stock || 0), 0);
    } else {
      productData.stock = productData.stock || 0;
    }
    
    // Set default values
    productData.rating = 0;
    productData.numReviews = 0;
    productData.primaryImageIndex = parseInt(productData.primaryImageIndex) || 0;
    productData.hoverImageIndex = parseInt(productData.hoverImageIndex) || 1;
    
    // Upload images to S3 if any
    if (req.files && req.files.length > 0) {
      try {
        const imageUrls = await Promise.all(
          req.files.map(file => uploadToS3(file))
        );
        productData.images = imageUrls;
        console.log('S3 image URLs:', productData.images);
      } catch (uploadError) {
        console.error('S3 upload failed:', uploadError);
        return res.status(400).json({ message: `Image upload failed: ${uploadError.message}` });
      }
    } else {
      productData.images = [];
    }
    
    const product = new Product(productData);
    await product.save();
    console.log('Product saved with stock:', product.stock, 'sizeVariants:', product.sizeVariants);
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(400).json({ message: error.message || 'Server error' });
  }
});

// Update product (Admin only)
router.put('/:id', adminAuth, validateObjectId, upload.array('images', 5), async (req, res) => {
  try {
    const productData = req.body;
    
    // Parse sizeVariants if it exists
    if (productData.sizeVariants && typeof productData.sizeVariants === 'string') {
      try {
        productData.sizeVariants = JSON.parse(productData.sizeVariants);
      } catch (e) {
        console.error('Failed to parse sizeVariants:', e);
      }
    }
    
    // Parse features if it exists
    if (productData.features && typeof productData.features === 'string') {
      try {
        productData.features = JSON.parse(productData.features);
      } catch (e) {
        console.error('Failed to parse features:', e);
      }
    }
    
    // Parse specifications if it exists
    if (productData.specifications && typeof productData.specifications === 'string') {
      try {
        productData.specifications = JSON.parse(productData.specifications);
      } catch (e) {
        console.error('Failed to parse specifications:', e);
      }
    }
    
    // Calculate total stock from size variants
    if (productData.sizeVariants && productData.sizeVariants.length > 0) {
      productData.stock = productData.sizeVariants.reduce((total, variant) => total + (variant.stock || 0), 0);
    }
    
    // Handle existing images
    let existingImages = [];
    if (productData.existingImages) {
      existingImages = JSON.parse(productData.existingImages);
    }
    
    // Upload new images to S3 if any
    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      try {
        newImageUrls = await Promise.all(
          req.files.map(file => uploadToS3(file))
        );
        console.log('New S3 image URLs:', newImageUrls);
      } catch (uploadError) {
        console.error('S3 upload failed:', uploadError);
        return res.status(400).json({ message: `Image upload failed: ${uploadError.message}` });
      }
    }
    
    // Combine existing and new images
    productData.images = [...existingImages, ...newImageUrls];
    
    // Handle image indices
    productData.primaryImageIndex = parseInt(productData.primaryImageIndex) || 0;
    productData.hoverImageIndex = parseInt(productData.hoverImageIndex) || 1;
    
    // Remove existingImages from productData as it's not part of the schema
    delete productData.existingImages;
    
    const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log('Product updated with stock:', product.stock, 'sizeVariants:', product.sizeVariants);
    res.json(product);
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Delete product (Admin only)
router.delete('/:id', adminAuth, validateObjectId, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review
router.post('/:id/reviews', auth, validateObjectId, sanitizeInput, validateReview, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating,
      comment
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;