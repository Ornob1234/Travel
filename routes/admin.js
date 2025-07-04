/*// routes/admin.js
const express = require('express');
const router = express.Router();

// Hardcoded admin credentials (or use database if needed)
const ADMIN_EMAIL = 'admin@travel.com';
const ADMIN_PASSWORD = 'admin123';

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.json({ admin: { email, role: 'admin' } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;
*/