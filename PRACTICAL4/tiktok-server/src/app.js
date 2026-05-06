const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

// Routes (add these as you create them)
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'TikTok server running!' });
});

module.exports = app;