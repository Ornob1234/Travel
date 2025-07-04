const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');




// Get all bookings (for admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('tourId', 'name');

    const transformed = bookings.map(b => ({
      _id: b._id,
      status: b.status,
      tour: {
        name: b.tourId?.name || 'Unknown Tour'
      },
      user: {
        name: b.userId?.name || 'Unknown User',
        email: b.userId?.email || 'N/A'
      }
    }));

    res.json(transformed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




/*
// Get all bookings (for admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId').populate('tourId');
    const transformed = bookings.map(b => ({
      _id: b._id,
      status: b.status,
      userName: b.userId?.name || 'Unknown User',
      email: b.userId?.email || 'N/A',
      tourName: b.tourId?.title || 'Unknown Tour',
    }));
    res.json(transformed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/

// Get all bookings
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('tourId');
const transformed = bookings.map(b => ({
  ...b._doc,
  tour: b.tourId // alias tourId as tour
}));
res.json(transformed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('userId').populate('tourId');
    booking ? res.json(booking) : res.status(404).json({ error: 'Booking not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a booking
router.put('/:id', async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    updated ? res.json(updated) : res.status(404).json({ error: 'Booking not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a booking
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    deleted ? res.json({ message: 'Booking deleted' }) : res.status(404).json({ error: 'Booking not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/confirm', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed' },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to confirm booking' });
  }
});


module.exports = router;
