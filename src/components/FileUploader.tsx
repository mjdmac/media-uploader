import React, { useState, useCallback } from "react";
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  FileIcon,
  Heart,
  Star,
  Camera,
  Video,
} from "lucide-react";
import axios from "axios";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "uploading" | "success" | "error";
  fileUrl?: string;
  error?: string;
}

const FileUploader: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <Camera className="h-8 w-8 text-blue-400" />;
    } else if (type.startsWith("video/")) {
      return <Video className="h-8 w-8 text-slate-400" />;
    }
    return <FileIcon className="h-8 w-8 text-gray-400" />;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "uploading" as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Upload each file
    fileList.forEach((file, index) => {
      uploadFile(file, files.length + index);
    });
  };

  const uploadFile = async (file: File, fileIndex: number) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );

            setFiles((prev) =>
              prev.map((f, i) =>
                i === fileIndex ? { ...f, progress: percentCompleted } : f
              )
            );
          },
        }
      );

      // Update file status to success
      setFiles((prev) =>
        prev.map((f, i) =>
          i === fileIndex
            ? {
                ...f,
                status: "success" as const,
                progress: 100,
                fileUrl: response.data.file.url,
              }
            : f
        )
      );
    } catch (error) {
      // Update file status to error
      setFiles((prev) =>
        prev.map((f, i) =>
          i === fileIndex
            ? {
                ...f,
                status: "error" as const,
                error: axios.isAxiosError(error)
                  ? error.response?.data?.error || "Upload failed"
                  : "Upload failed",
              }
            : f
        )
      );
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const openFile = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with special styling */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Heart className="h-8 w-8 text-blue-300 mr-3 animate-pulse" />
          <h1 className="text-5xl font-bold text-white drop-shadow-2xl bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
            JM and MJ Wedding Memories
          </h1>
          <Heart className="h-8 w-8 text-blue-300 ml-3 animate-pulse" />
        </div>
        <p className="text-xl text-white/90 drop-shadow-lg font-light">
          Share your beautiful moments with us ✨
        </p>
        <div className="flex items-center justify-center mt-4 space-x-2">
          <Star className="h-4 w-4 text-blue-300 animate-pulse" />
          <Star
            className="h-4 w-4 text-blue-300 animate-pulse"
            style={{ animationDelay: "0.2s" }}
          />
          <Star
            className="h-4 w-4 text-blue-300 animate-pulse"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>

      {/* Upload Area with enhanced design */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 transform hover:scale-105 ${
          dragActive
            ? "border-blue-300 bg-white/95 shadow-2xl scale-105"
            : "border-white/50 bg-white/80 hover:bg-white/90 shadow-xl"
        } backdrop-blur-lg`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Upload
                className={`h-16 w-16 text-blue-400 transition-all duration-300 ${
                  dragActive ? "animate-bounce" : ""
                }`}
              />
              <div className="absolute -top-2 -right-2">
                <Heart className="h-6 w-6 text-blue-400 animate-pulse" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-700 mb-3">
            Drop your precious memories here
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            or click to browse your photos and videos
          </p>

          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Camera className="h-5 w-5 mr-2 text-blue-400" />
              <span>Photos</span>
            </div>
            <div className="flex items-center">
              <Video className="h-5 w-5 mr-2 text-slate-400" />
              <span>Videos</span>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-400">
            Maximum file size: 500MB
          </div>
        </div>
      </div>

      {/* File List with enhanced styling */}
      {files.length > 0 && (
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-center mb-8">
            <Star className="h-5 w-5 text-blue-400 mr-2" />
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">
              Upload Progress
            </h2>
            <Star className="h-5 w-5 text-blue-400 ml-2" />
          </div>

          <div className="grid gap-6">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="bg-white/90 backdrop-blur-lg rounded-2xl border border-white/30 p-6 shadow-2xl transform transition-all duration-300 hover:scale-102 hover:shadow-3xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-gray-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <span>{formatFileSize(file.size)}</span>
                        {file.type.startsWith("image/") && (
                          <Camera className="h-4 w-4 ml-2 text-blue-400" />
                        )}
                        {file.type.startsWith("video/") && (
                          <Video className="h-4 w-4 ml-2 text-slate-400" />
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {file.status === "success" && (
                      <>
                        <div className="flex items-center">
                          <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                          <Heart className="h-4 w-4 text-blue-400 animate-pulse" />
                        </div>
                        {file.fileUrl && (
                          <button
                            onClick={() => openFile(file.fileUrl!)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-slate-500 text-white text-sm rounded-full hover:from-blue-500 hover:to-slate-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            View File ✨
                          </button>
                        )}
                      </>
                    )}

                    {file.status === "error" && (
                      <AlertCircle className="h-6 w-6 text-red-500" />
                    )}

                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Enhanced Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      file.status === "success"
                        ? "bg-gradient-to-r from-green-400 to-green-500"
                        : file.status === "error"
                        ? "bg-gradient-to-r from-red-400 to-red-500"
                        : "bg-gradient-to-r from-blue-400 to-slate-500"
                    } relative overflow-hidden`}
                    style={{ width: `${file.progress}%` }}
                  >
                    {file.status === "uploading" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    )}
                  </div>
                </div>

                {/* Status Text with enhanced styling */}
                <div className="flex justify-between items-center text-sm">
                  <span
                    className={`font-medium ${
                      file.status === "success"
                        ? "text-green-600"
                        : file.status === "error"
                        ? "text-red-600"
                        : "text-purple-600"
                    }`}
                  >
                    {file.status === "uploading" && (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-2"></div>
                        Uploading... {file.progress}%
                      </span>
                    )}
                    {file.status === "success" && (
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1 text-blue-400" />
                        Successfully uploaded!
                      </span>
                    )}
                    {file.status === "error" && `Error: ${file.error}`}
                  </span>

                  {file.status === "success" && (
                    <span className="text-green-600 font-semibold flex items-center">
                      <Star className="h-4 w-4 mr-1 text-blue-400" />
                      Ready to view
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
