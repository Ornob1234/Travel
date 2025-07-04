const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // adjust path if needed

// Connect to your DB
mongoose.connect('mongodb://localhost:27017/travel-explorer')
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // Remove existing admin if any
    await User.deleteOne({ email: 'admin@example.com' });

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      image: 'admin.jpg' // optional dummy image name
    });

    await admin.save();
    console.log('✅ Admin user created: admin@example.com / admin123');
    process.exit();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
