require('dotenv').config(); // ✅ Load environment variables

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();

// ✅ MongoDB Atlas URI & PORT
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Ornob:Ornob@cluster0.jbhf79d.mongodb.net/travelDB?retryWrites=true&w=majority&appName=Cluster0";
const PORT = process.env.PORT || 10000;

// ✅ MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Multer Upload Setup (Only for local/server uploads)
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// ✅ Serve Static Uploads (necessary for image visibility)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/tours', require('./routes/tours'));

// ✅ Serve frontend files
const frontendPath = path.join(__dirname, 'travel-explorer'); // Replace if folder name is different
app.use(express.static(frontendPath));

// ✅ Fallback route (for Single Page Apps)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html')); // Use the actual landing page
});

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
