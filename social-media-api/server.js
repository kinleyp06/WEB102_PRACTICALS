const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
app.use(morgan('dev'));

// Security middleware
app.use(helmet());
app.use(cors());

// Custom middleware for content negotiation
app.use(require('./middleware/formatResponse'));

// Static files
app.use(express.static('public'));

// API Documentation
app.get('/api-docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/likes', require('./routes/likes'));
app.use('/api/followers', require('./routes/followers'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Social Media API' });
});

// Error handler middleware
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in development mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});