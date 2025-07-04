// server.js
require('dotenv').config(); // ✅ Load environment variables from .env

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();

// ✅ MongoDB connection URI from .env (fallback hardcoded if .env is missing)
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Ornob:Ornob@cluster0.jbhf79d.mongodb.net/travelDB?retryWrites=true&w=majority&appName=Cluster0";
const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB Atlas
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ File Upload Setup (works only in local environment)
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// ✅ Serve uploaded images (for local testing only)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/tours', require('./routes/tours'));

// ✅ Serve Frontend (if it's in parent directory)
const frontendPath = path.join(__dirname); // travel-website/
app.use(express.static(frontendPath));

// ✅ Fallback route for SPA (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html')); // or 'profile.html' if that’s your main
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
