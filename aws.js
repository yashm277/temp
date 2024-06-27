import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Configure AWS
AWS.config.update({
  credentials: {
    // Your AWS credentials here
  },
  region: 'your-region' // e.g., 'us-west-2'
});

const s3 = new AWS.S3();

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const params = {
    Bucket: 'your-bucket-name',
    Key: req.file.originalname,
    Body: req.file.buffer
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).send('Error uploading file');
    }
    
    const fileUrl = data.Location;
    res.json({ url: fileUrl });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



// <!--  -->


document.getElementById('sendButton').addEventListener('click', async () => {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please select a file first.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    console.log('File uploaded successfully. URL:', data.url);
    // Do something with the URL here
  } catch (error) {
    console.error('Error uploading file:', error);
  }
});