const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Tour = require('../models/Tour');

// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Create tour with image upload
router.post('/', upload.single('image'), async (req, res) => {
  const { name, location, price, description, duration } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  const imagePath = `/uploads/${req.file.filename}`;

  try {
    const newTour = new Tour({
      name,
      location,
      price,
      description,
      duration,
      image: imagePath
    });

    const savedTour = await newTour.save();
    res.status(201).json(savedTour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving tour' });
  }
});


// Get all tours
router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a tour
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    tour ? res.json(tour) : res.status(404).json({ error: 'Tour not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a tour
router.put('/:id', async (req, res) => {
  try {
    const updated = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    updated ? res.json(updated) : res.status(404).json({ error: 'Tour not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a tour
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Tour.findByIdAndDelete(req.params.id);
    deleted ? res.json({ message: 'Tour deleted' }) : res.status(404).json({ error: 'Tour not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
