import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);
    
    cb(null, `${timestamp}-${randomString}-${nameWithoutExt}${extension}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  }
});

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Wedding Photo Upload Server is running',
    uploadsPath: uploadsDir,
    timestamp: new Date().toISOString()
  });
});

// Get list of uploaded files
app.get('/files', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const fileList = files.map(filename => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        originalName: filename.split('-').slice(2).join('-'), // Remove timestamp and random string
        size: stats.size,
        uploadDate: stats.birthtime,
        url: `http://localhost:${PORT}/uploads/${filename}`
      };
    });
    
    res.json({
      files: fileList,
      totalFiles: fileList.length,
      totalSize: fileList.reduce((sum, file) => sum + file.size, 0)
    });
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ error: 'Failed to read files' });
  }
});

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`File uploaded successfully: ${req.file.originalname}`);
    console.log(`Saved as: ${req.file.filename}`);
    console.log(`Size: ${req.file.size} bytes`);

    // Generate file URL
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

    res.json({
      message: 'File uploaded successfully',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl,
        uploadDate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      error: 'Failed to upload file',
      details: error.message 
    });
  }
});

// Delete file endpoint
app.delete('/files/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    fs.unlinkSync(filePath);
    console.log(`File deleted: ${filename}`);
    
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      error: 'Failed to delete file',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 500MB.' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎉 Wedding Photo Upload Server running on port ${PORT}`);
  console.log(`📁 Files will be stored in: ${uploadsDir}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 File list: http://localhost:${PORT}/files`);
});