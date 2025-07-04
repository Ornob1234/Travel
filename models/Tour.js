const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: String,
  destination: String,
  price: Number,
  description: String,
  image: String,
  duration: String,
  availableDates: [Date]
});



// routes/tours.js
const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');

// GET all tours
router.get('/', async (req, res) => {
  const tours = await Tour.find();
  res.json(tours);
});

// GET single tour
router.get('/:id', async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  res.json(tour);
});

// POST create tour
router.post('/', async (req, res) => {
  const newTour = new Tour(req.body);
  await newTour.save();
  res.status(201).json(newTour);
});

// PUT update tour
router.put('/:id', async (req, res) => {
  const updated = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE tour
router.delete('/:id', async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.json({ message: 'Tour deleted' });
});


module.exports = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

