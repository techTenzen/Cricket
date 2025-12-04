const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const makeS3Public = async () => {
  const bucketPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        Principal: '*',
        Action: 's3:GetObject',
        Resource: `arn:aws:s3:::${process.env.S3_BUCKET_NAME}/products/*`
      }
    ]
  };

  try {
    await s3.putBucketPolicy({
      Bucket: process.env.S3_BUCKET_NAME,
      Policy: JSON.stringify(bucketPolicy)
    }).promise();
    
    console.log('✅ S3 bucket policy updated - products folder is now public');
  } catch (error) {
    console.error('❌ Failed to update bucket policy:', error.message);
    console.log('You may need to manually set the bucket policy in AWS Console');
  }
};

makeS3Public();