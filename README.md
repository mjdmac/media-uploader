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

Create a `backend/.env` file with your Cloudinary credentials:
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

### Get Optimized Image
- **GET** `/optimize/:cloudinaryId?width=300&height=200&quality=auto`
- Get optimized image URL with custom dimensions and quality
### Health Check
- **GET** `/health`
- Check server status and Cloudinary configuration

## Configuration

### File Size Limit
Edit `backend/server.js` to change the file size limit:
```javascript
limits: {
  fileSize: 500 * 1024 * 1024, // 500MB limit
}
```

### Allowed File Types
Edit the `fileFilter` function in `backend/server.js`:
```javascript
fileFilter: (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'));
  }
}
```

### Port Configuration
Update the `backend/.env` file:
```
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
PORT=3001
```

### Cloudinary Settings
- **Folder Organization**: Files are stored in `wedding-memories` folder
- **Auto-optimization**: Images are automatically optimized for web delivery
- **Format Detection**: Automatic format selection for best performance
- **CDN Delivery**: Global content delivery network for fast access

## File Management

### Viewing Files
- Click "View File" button to open files via Cloudinary CDN
- Files are delivered through Cloudinary's optimized CDN

### Accessing All Files
Visit `http://localhost:3001/files` to see a JSON list of all uploaded files with Cloudinary metadata.

### Cloudinary Dashboard
- Access your files through Cloudinary's web dashboard
- Advanced media management and analytics
- Bulk operations and transformations

## Production Deployment

### Security Considerations
1. **File Validation**: Only images and videos are allowed
2. **Size Limits**: 500MB maximum file size
3. **Unique IDs**: Cloudinary assigns unique public IDs
4. **CORS**: Configured for local development (update for production)
5. **Secure URLs**: All files served over HTTPS via Cloudinary

### For Production Use
1. **HTTPS**: Use HTTPS in production
2. **Authentication**: Consider adding user authentication
3. **Backup**: Cloudinary provides automatic backups and redundancy
4. **Scaling**: Cloudinary handles scaling automatically
5. **CDN**: Built-in global CDN for optimal performance

## Customization

### Design Changes
- Edit `src/App.tsx` for background and layout
- Edit `src/components/FileUploader.tsx` for upload interface
- Modify Tailwind classes for different colors and animations

### Adding Features
- **User Authentication**: Add login system
- **File Categories**: Organize by photo/video type
- **Thumbnails**: Use Cloudinary's transformation API for thumbnails
- **Advanced Transformations**: Leverage Cloudinary's powerful transformation features
- **AI Features**: Use Cloudinary's AI-powered features for auto-tagging and content analysis

## Troubleshooting

### Common Issues

1. **"Cannot POST /upload"**
   - Make sure backend server is running on port 3001
   - Check CORS configuration

2. **File upload fails**
   - Check file size (max 500MB)
   - Verify file type (images/videos only)
   - Verify Cloudinary credentials in .env file
   - Check Cloudinary account limits

3. **Cloudinary upload fails**
   - Verify API credentials are correct
   - Check Cloudinary account status and limits
   - Ensure network connectivity

4. **Frontend not connecting to backend**
   - Ensure backend is running on port 3001
   - Check for CORS errors in browser console

5. **Cloudinary configuration issues**
   - Verify .env file exists in backend folder
   - Check that all three Cloudinary credentials are set
   - Test credentials with health check endpoint

### Logs
- Backend logs appear in the terminal where you ran `npm run dev`
- Frontend errors appear in browser developer console
- Cloudinary upload status is logged in backend console

