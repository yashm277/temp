import express, { Request, Response } from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const port = 3000;

// Configure AWS SDK v3 client
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  },
  region: process.env.AWS_REGION,
  // Include custom endpoint if necessary
  endpoint: process.env.AWS_ENDPOINT // Optional: Specify custom endpoint here
});

// Set up multer for file uploads
const uploadchat = multer({ dest: 'uploads/' });

// Endpoint to upload a file
app.post('/upload', uploadchat.single('file'), async (req: Request, res: Response) => {
  const fileContent = fs.readFileSync(req.file.path);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: req.file.originalname,
    Body: fileContent,
    ACL: 'public-read'
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);

    // Delete the file from the local uploads directory
    fs.unlinkSync(req.file.path);

    // Return the file URL in the response
    res.status(200).json({
      message: 'File uploaded successfully',
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${req.file.originalname}`,
      data
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: err.message });
  }
});

// Custom endpoint example
app.get('/custom', (req: Request, res: Response) => {
  res.send('Hello from custom endpoint!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
