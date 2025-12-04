const AWS = require('aws-sdk');
const multer = require('multer');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Use memory storage instead of multer-s3
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: function (req, file, cb) {
    cb(null, file.mimetype.startsWith('image/'));
  }
});

// Manual S3 upload function
const uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `products/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype
  };
  
  const result = await s3.upload(params).promise();
  return result.Location;
};

module.exports = { upload, s3, uploadToS3 };