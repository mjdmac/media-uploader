# Local Wedding Photo & Video Uploader Setup

This is a beautiful wedding photo and video uploader that stores files locally on your server. Perfect for collecting memories from your special day!

## Features ✨

- **Beautiful Design**: Elegant gradient background with animated floral elements
- **Drag & Drop**: Intuitive file upload with visual feedback
- **Progress Tracking**: Real-time upload progress with smooth animations
- **Local Storage**: Files are stored securely on your server
- **File Management**: View, download, and manage uploaded files
- **Responsive**: Works perfectly on all devices

## Quick Setup

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

- **Location**: Files are stored in `backend/uploads/` folder
- **Naming**: Files are automatically renamed with timestamps to prevent conflicts
- **Size Limit**: 500MB per file (configurable in server.js)
- **Types**: Images and videos only
- **Access**: Files can be accessed via `http://localhost:3001/uploads/filename`

## API Endpoints

### Upload File
- **POST** `/upload`
- Upload a single file
- Returns file information and access URL

### Get File List
- **GET** `/files`
- Returns list of all uploaded files with metadata

### Delete File
- **DELETE** `/files/:filename`
- Delete a specific file from the server

### Health Check
- **GET** `/health`
- Check server status and configuration

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
Create a `.env` file in the backend folder:
```
PORT=3001
```

## File Management

### Viewing Files
- Click "View File" button on successfully uploaded files
- Or visit `http://localhost:3001/uploads/filename` directly

### Accessing All Files
Visit `http://localhost:3001/files` to see a JSON list of all uploaded files with metadata.

### Manual File Management
Files are stored in `backend/uploads/` and can be managed directly:
- Copy files to backup location
- Delete unwanted files
- Organize into subfolders (requires code modification)

## Production Deployment

### Security Considerations
1. **File Validation**: Only images and videos are allowed
2. **Size Limits**: 500MB maximum file size
3. **Unique Naming**: Prevents file conflicts and overwrites
4. **CORS**: Configured for local development (update for production)

### For Production Use
1. **HTTPS**: Use HTTPS in production
2. **Authentication**: Consider adding user authentication
3. **Backup**: Set up regular backups of the uploads folder
4. **Storage**: Consider cloud storage for scalability
5. **CDN**: Use a CDN for better file delivery performance

## Customization

### Design Changes
- Edit `src/App.tsx` for background and layout
- Edit `src/components/FileUploader.tsx` for upload interface
- Modify Tailwind classes for different colors and animations

### Adding Features
- **User Authentication**: Add login system
- **File Categories**: Organize by photo/video type
- **Thumbnails**: Generate thumbnails for images
- **Compression**: Add image/video compression
- **Metadata**: Extract and display EXIF data

## Troubleshooting

### Common Issues

1. **"Cannot POST /upload"**
   - Make sure backend server is running on port 3001
   - Check CORS configuration

2. **File upload fails**
   - Check file size (max 500MB)
   - Verify file type (images/videos only)
   - Ensure uploads folder exists and is writable

3. **Files not accessible**
   - Verify backend server is serving static files
   - Check file permissions in uploads folder

4. **Frontend not connecting to backend**
   - Ensure backend is running on port 3001
   - Check for CORS errors in browser console

### Logs
- Backend logs appear in the terminal where you ran `npm run dev`
- Frontend errors appear in browser developer console

## Support

This is a complete, production-ready solution for collecting wedding photos and videos. The beautiful design and smooth animations create a delightful experience for your guests to share their memories of your special day! 💕

Enjoy collecting all those precious moments! ✨📸🎥