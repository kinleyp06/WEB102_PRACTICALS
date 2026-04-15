const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8000;

// ===================== MIDDLEWARE =====================
// Configure CORS for frontend connection
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(morgan('dev')); // HTTP request logging

// ===================== FILE STORAGE SETUP =====================
// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// ===================== MULTER CONFIGURATION =====================
// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename: timestamp-originalname
        const timestamp = Date.now();
        const originalName = file.originalname.replace(/\s/g, '_');
        cb(null, `${timestamp}-${originalName}`);
    }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
    // Accept only specific mime types
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and PDF files are allowed.'), false);
    }
};

// Create the multer instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB in bytes
    },
    fileFilter: fileFilter
});

// ===================== ROUTES =====================
// Basic route for testing
app.get('/', (req, res) => {
    res.send('File Upload Server is running');
});

// File upload route (single file)
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        console.log('File received:', req.file.originalname);
        console.log('File type:', req.file.mimetype);
        console.log('File size:', req.file.size);
        
        // Get additional form data if any
        const additionalData = req.body;
        
        // Success response with file details
        return res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url: `/uploads/${req.file.filename}`,
            additionalData: additionalData
        });
        
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Optional: Multiple file upload route
app.post('/api/upload-multiple', upload.array('files', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        
        const uploadedFiles = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: `/uploads/${file.filename}`
        }));
        
        res.status(200).json({
            success: true,
            message: `${req.files.length} files uploaded successfully`,
            files: uploadedFiles
        });
        
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route to get list of uploaded files
app.get('/api/files', (req, res) => {
    try {
        fs.readdir(uploadDir, (err, files) => {
            if (err) {
                return res.status(500).json({ error: 'Unable to scan directory' });
            }
            
            const fileInfos = files.map(file => {
                const stats = fs.statSync(path.join(uploadDir, file));
                return {
                    name: file,
                    size: stats.size,
                    modified: stats.mtime,
                    url: `/uploads/${file}`
                };
            });
            
            res.json({ files: fileInfos });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to delete a file
app.delete('/api/files/:filename', (req, res) => {
    try {
        const filepath = path.join(uploadDir, req.params.filename);
        
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            res.json({ success: true, message: 'File deleted successfully' });
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===================== ERROR HANDLING =====================
// Error handling for multer errors
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ error: err.message });
    } else if (err) {
        // Any other error
        console.error(err);
        return res.status(500).json({ error: err.message || 'Server error' });
    }
    next();
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ===================== START SERVER =====================
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Uploads directory: ${uploadDir}`);
    console.log(` CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
}); 