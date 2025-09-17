# media-uploader
Specifically made to upload photos and videos for a wedding event using Cloudinary storage


# Local Wedding Photo & Video Uploader Setup

This is a beautiful wedding photo and video uploader that stores files in Cloudinary cloud storage. Perfect for collecting memories from your special day!

## Features ✨

- **Beautiful Design**: Elegant gradient background with animated floral elements
- **Drag & Drop**: Intuitive file upload with visual feedback
- **Progress Tracking**: Real-time upload progress with smooth animations
- **Cloud Storage**: Files are stored securely in Cloudinary with automatic optimization
- **File Management**: View, download, and manage uploaded files
- **Responsive**: Works perfectly on all devices
- **Image Optimization**: Automatic image optimization and format conversion
- **CDN Delivery**: Fast global content delivery through Cloudinary's CDN

## Quick Setup

### 0. Cloudinary Configuration

Create a backend `.env` file with your Cloudinary credentials:
```
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
PORT=3001
```

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
npm install
```

### 2. Start the Servers

**Start Backend (Terminal 1):**
```bash
cd backend
npm run dev
```
The backend will start on http://localhost:3001

**Start Frontend (Terminal 2):**
```bash
npm run dev
```
The frontend will start on http://localhost:5173

### 3. Start Uploading! 🎉

Open your browser and go to http://localhost:5173 to start uploading your wedding photos and videos!

## File Storage

- **Location**: Files are stored in Cloudinary cloud storage
- **Organization**: Files are organized in the `wedding-memories` folder
- **Naming**: Files are automatically assigned unique public IDs
- **Size Limit**: 500MB per file (configurable in server.js)
- **Types**: Images and videos only
- **Access**: Files are accessible via Cloudinary's CDN URLs
- **Optimization**: Automatic image optimization and format conversion

## API Endpoints

### Upload File
- **POST** `/upload`
- Upload a single file
- Uploads to Cloudinary and returns file information with CDN URL

### Get File List
- **GET** `/files`
- Returns list of all uploaded files with Cloudinary metadata

### Delete File
- **DELETE** `/files/:cloudinaryId`
- Delete a specific file from Cloudinary


### Cloudinary Settings
- **Folder Organization**: Files are stored in `wedding-memories` folder
- **Auto-optimization**: Images are automatically optimized for web delivery
- **Format Detection**: Automatic format selection for best performance
- **CDN Delivery**: Global content delivery network for fast access

