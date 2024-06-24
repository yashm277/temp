const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY_ID', // Replace with your actual access key ID
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY', // Replace with your actual secret access key
  region: 'YOUR_AWS_REGION' // Replace with your actual AWS region
});

const s3 = new AWS.S3();
const bucketName = 'YOUR_S3_BUCKET_NAME'; // Replace with your S3 bucket name

const corsConfiguration = {
  CORSRules: [
    {
      AllowedOrigins: ['*'],
      AllowedMethods: ['GET', 'POST', 'PUT'],
      AllowedHeaders: ['*']
    }
  ]
};

s3.putBucketCors({
  Bucket: bucketName,
  CORSConfiguration: corsConfiguration
}, (err, data) => {
  if (err) {
    console.error('Error configuring CORS:', err);
  } else {
    console.log('CORS configuration successfully applied:', data);
  }
});
