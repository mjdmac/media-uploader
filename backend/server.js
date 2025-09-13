import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory for temporary files
const uploadsDir = path.join(__dirname, "temp-uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for temporary file storage
// Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const originalName = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);

    cb(null, `${timestamp}-${randomString}-${nameWithoutExt}${extension}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and videos
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed!"));
    }
  },
});

// In-memory storage for uploaded files metadata
let uploadedFiles = [];

// In-memory storage for uploaded files metadata
let uploadedFiles = [];

// Routes
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Wedding Photo Upload Server with Cloudinary is running",
    cloudinary: {
      configured: !!process.env.CLOUD_NAME,
      cloud_name: process.env.CLOUD_NAME,
    },
    timestamp: new Date().toISOString(),
  });
});

// Get list of uploaded files
app.get("/files", (req, res) => {
  try {
    res.json({
      files: uploadedFiles,
      totalFiles: uploadedFiles.length,
      totalSize: uploadedFiles.reduce((sum, file) => sum + file.size, 0),
    });
  } catch (error) {
    console.error("Error reading files:", error);
    res.status(500).json({ error: "Failed to read files" });
  }
});

// Upload endpoint with Cloudinary integration
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`Processing file: ${req.file.originalname}`);
    console.log(`Temporary file: ${req.file.filename}`);
    console.log(`Processing file: ${req.file.originalname}`);
    console.log(`Temporary file: ${req.file.filename}`);
    console.log(`Size: ${req.file.size} bytes`);

    // Upload to Cloudinary
    const uploadOptions = {
      resource_type: "auto", // Automatically detect file type (image/video)
      folder: "wedding-memories", // Organize files in a folder
      public_id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`, // Unique public ID
      use_filename: true,
      unique_filename: false,
    };

    const cloudinaryResult = await cloudinary.uploader.upload(
      req.file.path,
      uploadOptions
    );

    // Clean up temporary file
    fs.unlinkSync(req.file.path);

    // Store file metadata
    const fileMetadata = {
      originalName: req.file.originalname,
      filename: cloudinaryResult.public_id,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: cloudinaryResult.secure_url,
      cloudinaryId: cloudinaryResult.public_id,
      uploadDate: new Date().toISOString(),
      format: cloudinaryResult.format,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height,
      resourceType: cloudinaryResult.resource_type,
    };

    uploadedFiles.push(fileMetadata);

    console.log(
      `File uploaded to Cloudinary successfully: ${cloudinaryResult.secure_url}`
    );

    res.json({
      message: "File uploaded successfully to Cloudinary",
      file: fileMetadata,
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Clean up temporary file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: "Failed to upload file to Cloudinary",
      details: error.message,
    });
  }
});

// Delete file endpoint with Cloudinary integration
app.delete("/files/:cloudinaryId", async (req, res) => {
  try {
    const cloudinaryId = req.params.cloudinaryId;

    // Find file in our metadata
    const fileIndex = uploadedFiles.findIndex(
      (file) => file.cloudinaryId === cloudinaryId
    );

    if (fileIndex === -1) {
      return res.status(404).json({ error: "File not found" });
    }

    const file = uploadedFiles[fileIndex];

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(cloudinaryId, {
      resource_type: file.resourceType || "auto",
    });

    // Remove from our metadata
    uploadedFiles.splice(fileIndex, 1);

    console.log(`File deleted from Cloudinary: ${cloudinaryId}`);

    res.json({ message: "File deleted successfully from Cloudinary" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      error: "Failed to delete file from Cloudinary",
      details: error.message,
    });
  }
});

// Get optimized image URL endpoint
app.get("/optimize/:cloudinaryId", (req, res) => {
  try {
    const { cloudinaryId } = req.params;
    const { width, height, quality = "auto", format = "auto" } = req.query;

    let transformation = {
      quality,
      fetch_format: format,
    };

    if (width) transformation.width = parseInt(width);
    if (height) transformation.height = parseInt(height);

    const optimizedUrl = cloudinary.url(cloudinaryId, transformation);

    res.json({
      originalId: cloudinaryId,
      optimizedUrl,
      transformation,
    });
  } catch (error) {
    console.error("Optimization error:", error);
    res.status(500).json({
      error: "Failed to generate optimized URL",
      details: error.message,
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 500MB." });
    }
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `🎉 Wedding Photo Upload Server with Cloudinary running on port ${PORT}`
  );
  console.log(`☁️  Cloudinary configured for: ${process.env.CLOUD_NAME}`);
  console.log(`📁 Temporary files stored in: ${uploadsDir}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 File list: http://localhost:${PORT}/files`);
});
