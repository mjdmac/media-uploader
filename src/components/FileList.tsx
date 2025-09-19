import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Eye,
  Trash2,
  Download,
  Calendar,
  FileIcon,
  Camera,
  Video,
  HardDrive,
  Grid3X3,
  List,
  Play,
  X,
} from "lucide-react";
import axios from "axios";

interface CloudinaryFile {
  originalName: string;
  size: number;
  mimetype: string;
  resource_type: string;
  url: string;
  public_id: string;
  created_at: string;
  format: string;
  width?: number;
  height?: number;
}

interface FilesResponse {
  files: CloudinaryFile[];
  totalFiles: number;
  totalSize: number;
}

const FileList: React.FC = () => {
  const [files, setFiles] = useState<CloudinaryFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFile, setSelectedFile] = useState<CloudinaryFile | null>(null);

  const BACKEND_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3001"
      : import.meta.env.VITE_BACKEND_URL;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getFileIcon = (mimetype: string, resourceType: string) => {
    if (resourceType === "image" || mimetype.startsWith("image/")) {
      return <Camera className="h-5 w-5 text-blue-500" />;
    } else if (resourceType === "video" || mimetype.startsWith("video/")) {
      return <Video className="h-5 w-5 text-purple-500" />;
    }
    return <FileIcon className="h-5 w-5 text-gray-500" />;
  };

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<FilesResponse>(`${BACKEND_URL}/files`);
      setFiles(response.data.files);
      setTotalFiles(response.data.totalFiles);
      setTotalSize(response.data.totalSize);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.error || "Failed to fetch files"
          : "Failed to fetch files"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (cloudinaryId: string, originalName: string) => {
    if (!confirm(`Are you sure you want to delete "${originalName}"?`)) {
      return;
    }

    try {
      await axios.delete(`${BACKEND_URL}/files/${cloudinaryId}`);
      await fetchFiles(); // Refresh the list
      setSelectedFile(null); // Close modal if deleted file was selected
    } catch (err) {
      alert(
        axios.isAxiosError(err)
          ? err.response?.data?.error || "Failed to delete file"
          : "Failed to delete file"
      );
    }
  };

  const openModal = (file: CloudinaryFile) => {
    setSelectedFile(file);
  };

  const closeModal = () => {
    setSelectedFile(null);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-white/30 p-8 shadow-2xl">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mr-3" />
            <span className="text-xl text-gray-700">Loading files...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-red-200 p-8 shadow-2xl">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error loading files</div>
            <div className="text-gray-600 mb-4">{error}</div>
            <button
              onClick={fetchFiles}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white drop-shadow-2xl bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent mb-4">
          Wedding Memory Gallery
        </h2>
        <div className="flex items-center justify-center space-x-8 text-white/90">
          <div className="flex items-center">
            <FileIcon className="h-5 w-5 mr-2" />
            <span className="font-semibold">{totalFiles} Files</span>
          </div>
          <div className="flex items-center">
            <HardDrive className="h-5 w-5 mr-2" />
            <span className="font-semibold">
              {formatFileSize(totalSize)} Total
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg border ${
              viewMode === "grid"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white/20 backdrop-blur-lg text-white border-white/30 hover:bg-white/30"
            }`}
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg border ${
              viewMode === "list"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white/20 backdrop-blur-lg text-white border-white/30 hover:bg-white/30"
            }`}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </button>
        </div>

        <button
          onClick={fetchFiles}
          className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-lg text-white rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/30"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {files.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-white/30 p-12 shadow-2xl text-center">
          <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No files uploaded yet
          </h3>
          <p className="text-gray-500">
            Upload some beautiful wedding memories to see them here!
          </p>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {files.map((file) => (
                <div
                  key={file.public_id}
                  className="bg-white/90 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square bg-gradient-to-br from-blue-50 to-purple-50">
                    {file.resource_type === "image" ? (
                      <img
                        src={file.url}
                        alt={file.originalName}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => openModal(file)}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 cursor-pointer"
                        onClick={() => openModal(file)}
                      >
                        <div className="text-center">
                          <Video className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                          <Play className="h-8 w-8 text-purple-600 mx-auto" />
                        </div>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => openModal(file)}
                          className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-200"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <a
                          href={file.url}
                          download={file.originalName}
                          className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-200"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFile(file.public_id, file.originalName);
                          }}
                          className="p-2 bg-red-500/80 backdrop-blur-sm text-white rounded-full hover:bg-red-600/80 transition-all duration-200"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-2 left-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          file.resource_type === "image"
                            ? "bg-blue-500/80 text-white"
                            : "bg-purple-500/80 text-white"
                        }`}
                      >
                        {file.resource_type === "image" ? "Photo" : "Video"}
                      </span>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="p-4">
                    <div
                      className="font-medium text-gray-900 text-sm truncate mb-1"
                      title={file.originalName}
                    >
                      {file.originalName}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>{formatFileSize(file.size)}</div>
                      {file.width && file.height && (
                        <div>
                          {file.width} × {file.height}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(file.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        File
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        Dimensions
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        Upload Date
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {files.map((file, index) => (
                      <tr
                        key={file.public_id}
                        className={`hover:bg-blue-50 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {getFileIcon(file.resource_type, file.mimetype)}
                            <div className="ml-3">
                              <div
                                className="text-sm font-medium text-gray-900 truncate max-w-xs"
                                title={file.originalName}
                              >
                                {file.originalName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {file.format.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              file.resource_type === "image"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {file.resource_type === "image" ? "Photo" : "Video"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {file.width && file.height
                            ? `${file.width} × ${file.height}`
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {formatDate(file.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => openModal(file)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-all duration-200"
                              title="View file"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <a
                              href={file.url}
                              download={file.originalName}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-all duration-200"
                              title="Download file"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                            <button
                              onClick={() =>
                                deleteFile(file.public_id, file.originalName)
                              }
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-all duration-200"
                              title="Delete file"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 p-4">
                {files.map((file) => (
                  <div
                    key={file.public_id}
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center flex-1 min-w-0">
                        {getFileIcon(file.resource_type, file.mimetype)}
                        <div className="ml-3 flex-1 min-w-0">
                          <div
                            className="text-sm font-medium text-gray-900 truncate"
                            title={file.originalName}
                          >
                            {file.originalName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {file.format.toUpperCase()} •{" "}
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          file.resource_type === "image"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {file.resource_type === "image" ? "Photo" : "Video"}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mb-3">
                      <div className="flex items-center mb-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(file.created_at)}
                      </div>
                      {file.width && file.height && (
                        <div>
                          Dimensions: {file.width} × {file.height}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openModal(file)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-all duration-200"
                        title="View file"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <a
                        href={file.url}
                        download={file.originalName}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-all duration-200"
                        title="Download file"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() =>
                          deleteFile(file.public_id, file.originalName)
                        }
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-all duration-200"
                        title="Delete file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-200"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Content */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              {selectedFile.resource_type === "image" ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.originalName}
                  className="w-full max-h-[70vh] object-contain"
                />
              ) : (
                <video
                  src={selectedFile.url}
                  controls
                  className="w-full max-h-[70vh]"
                />
              )}

              {/* File Info */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedFile.originalName}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Size:</span>{" "}
                        {formatFileSize(selectedFile.size)}
                      </div>
                      <div>
                        <span className="font-medium">Format:</span>{" "}
                        {selectedFile.format.toUpperCase()}
                      </div>
                      {selectedFile.width && selectedFile.height && (
                        <div>
                          <span className="font-medium">Dimensions:</span>{" "}
                          {selectedFile.width} × {selectedFile.height}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Uploaded:</span>{" "}
                        {formatDate(selectedFile.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <a
                      href={selectedFile.url}
                      download={selectedFile.originalName}
                      className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200"
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                    <button
                      onClick={() =>
                        deleteFile(
                          selectedFile.public_id,
                          selectedFile.originalName
                        )
                      }
                      className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileList;
