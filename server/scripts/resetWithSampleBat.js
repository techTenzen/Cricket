const mongoose = require('mongoose');
const Product = require('../models/Product');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Create a simple bat image (SVG converted to buffer)
const createBatImage = () => {
  const svgContent = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="#8B4513"/>
    <rect x="50" y="50" width="300" height="200" fill="#D2691E" rx="10"/>
    <rect x="180" y="20" width="40" height="260" fill="#654321"/>
    <text x="200" y="160" font-family="Arial" font-size="24" fill="white" text-anchor="middle">CRICKET BAT</text>
  </svg>`;
  
  return Buffer.from(svgContent);
};

const resetWithSampleBat = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear all products
    await Product.deleteMany({});
    console.log('All products cleared');
    
    // Upload sample bat image to S3
    const imageBuffer = createBatImage();
    const imageKey = `products/sample-cricket-bat-${Date.now()}.svg`;
    
    await s3.upload({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: imageKey,
      Body: imageBuffer,
      ContentType: 'image/svg+xml'
    }).promise();
    
    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;
    console.log('Sample image uploaded:', imageUrl);
    
    // Create sample bat product
    const sampleBat = new Product({
      name: 'Professional Willow Cricket Bat',
      description: 'Premium English willow cricket bat for professional players. Perfectly balanced with excellent pickup.',
      price: 12999,
      category: 'bats',
      brand: 'SS',
      images: [imageUrl],
      stock: 15,
      rating: 4.8,
      numReviews: 25,
      specifications: {
        weight: '1.15kg',
        material: 'English Willow',
        size: 'Short Handle',
        color: 'Natural'
      }
    });
    
    await sampleBat.save();
    console.log('Sample cricket bat added successfully');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

resetWithSampleBat();