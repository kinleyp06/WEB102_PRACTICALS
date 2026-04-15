// components/FileUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadResult, setUploadResult] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            createPreview(file);
        }
    };

    const createPreview = (file) => {
        if (file.type.startsWith('image/')) {
            const previewUrl = URL.createObjectURL(file);
            setFilePreview({ url: previewUrl, name: file.name, type: file.type });
        } else if (file.type === 'application/pdf') {
            setFilePreview({ name: file.name, type: file.type });
        } else {
            setFilePreview(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setUploadResult(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:8000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentage = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentage);
                },
            });

            setUploadResult({
                success: true,
                message: 'File uploaded successfully!',
                data: response.data
            });
        } catch (error) {
            console.error('Upload error:', error);
            setUploadResult({
                success: false,
                message: error.response?.data?.error || 'Upload failed'
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">File Upload</h2>
            
            {/* File Input */}
            <div className="mb-4">
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Allowed formats: JPEG, PNG, PDF (Max size: 5MB)
                </p>
            </div>

            {/* File Preview */}
            {filePreview && (
                <div className="mb-4">
                    <h3 className="font-medium mb-1">Preview:</h3>
                    <div className="border rounded p-2">
                        {filePreview.type?.startsWith('image') ? (
                            <img 
                                src={filePreview.url} 
                                alt={filePreview.name} 
                                className="max-w-full h-auto max-h-40 rounded" 
                            />
                        ) : filePreview.type === 'application/pdf' ? (
                            <div className="py-2 px-3 bg-gray-100 rounded flex items-center">
                                <svg className="w-6 h-6 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6.414A2 2 0 0 0 16.414 5L14 2.586A2 2 0 0 0 12.586 2H9z" />
                                    <path d="M3 8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
                                </svg>
                                <span>{filePreview.name}</span>
                            </div>
                        ) : (
                            <div>File selected: {filePreview.name}</div>
                        )}
                    </div>
                </div>
            )}

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
                className={`w-full py-2 px-4 rounded-lg font-semibold text-white
                    ${isUploading || !selectedFile 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload File'}
            </button>

            {/* Upload Progress */}
            {isUploading && uploadProgress > 0 && (
                <div className="mt-4">
                    <div className="bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-600 mt-1 text-center">
                        {uploadProgress}% uploaded
                    </p>
                </div>
            )}

            {/* Upload Result */}
            {uploadResult && (
                <div className={`mt-4 p-4 rounded-lg ${
                    uploadResult.success 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                }`}>
                    <p className={`font-semibold ${
                        uploadResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                        {uploadResult.message}
                    </p>
                    {uploadResult.success && uploadResult.data && (
                        <div className="mt-2 text-sm">
                            <p><strong>Original Name:</strong> {uploadResult.data.originalName}</p>
                            <p><strong>File Type:</strong> {uploadResult.data.mimetype}</p>
                            <p><strong>Size:</strong> {(uploadResult.data.size / 1024).toFixed(2)} KB</p>
                            <p><strong>URL:</strong> <a 
                                href={`http://localhost:8000${uploadResult.data.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                View File
                            </a></p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUpload;