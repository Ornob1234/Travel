// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' } // Add this
}, { timestamps: true });


module.exports = mongoose.models.User || mongoose.model('User', userSchema);
