const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage });

// ➤ SIGNUP: Create User (default role = 'user')
router.post('/signup', upload.single('image'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const image = req.file?.filename;

    if (!name || !email || !password || !image) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, image, role: 'user' });
    const saved = await user.save();

    res.status(201).json({
      user: {
        _id: saved._id,
        name: saved.name,
        email: saved.email,
        image: saved.image,
        role: saved.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed: ' + err.message });
  }
});

// ➤ LOGIN: Support Admin & Normal Users
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Try finding admin in DB
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    message: 'Login successful',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role
    }
  });
});

// ➤ GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user ? res.json(user) : res.status(404).json({ error: 'User not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ➤ DELETE user
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


router.get('/', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
