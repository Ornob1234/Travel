require('dotenv').config();
const mongoose = require('./config/db');
const User = require('./models/User');
const Tour = require('./models/Tour');
const Booking = require('./models/Booking');

const seed = async () => {
  try {
    await User.deleteMany();
    await Tour.deleteMany();
    await Booking.deleteMany();

    // 1. Users
    const users = await User.insertMany([
      { name: "Alice", email: "alice@example.com", password: "123456", role: "user" },
      { name: "Bob", email: "bob@example.com", password: "123456", role: "admin" }
    ]);

    // 2. Tours
    const tours = await Tour.insertMany([
      {
        title: "Discover Bali",
        destination: "Bali, Indonesia",
        description: "A tropical paradise with temples and beaches.",
        duration: "5 days",
        price: 499,
        image: "https://source.unsplash.com/800x400/?bali",
        availableDates: ["2025-07-10", "2025-08-15"]
      },
      {
        title: "Explore Paris",
        destination: "Paris, France",
        description: "Visit the Eiffel Tower and the Louvre.",
        duration: "4 days",
        price: 699,
        image: "https://source.unsplash.com/800x400/?paris",
        availableDates: ["2025-09-10", "2025-10-20"]
      }
    ]);

    // 3. Bookings
    await Booking.insertMany([
      {
        userId: users[0]._id,
        tourId: tours[0]._id,
        travelDate: "2025-07-10",
        guests: 2,
        status: "confirmed"
      },
      {
        userId: users[1]._id,
        tourId: tours[1]._id,
        travelDate: "2025-10-20",
        guests: 1,
        status: "pending"
      }
    ]);

    console.log("✅ Sample data inserted successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

seed();
