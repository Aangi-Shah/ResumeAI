require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const auth = require('./middleware/auth');
const authController = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Routes
app.use('/api/auth', authRoutes);

app.put(
  '/api/auth/profile',
  auth,
  authController.updateProfile
);

app.use('/api/applications', applicationRoutes);

app.use('/api/resume', resumeRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.send('ResumeAI API is running');
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;