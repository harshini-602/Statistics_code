/**
 * Simple seed script to create demo users (reader and blogger).
 * Run with: node backend/seed.js (ensure .env is set or use .env.example values)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const { hashPassword } = require('./utils/auth');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blogify';

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing users with these demo emails
    await User.deleteMany({ email: { $in: ['reader@example.com', 'blogger@example.com'] } });

    const reader = new User({
      username: 'reader',
      email: 'reader@example.com',
      password: await hashPassword('password123'),
      role: 'user'
    });

    const blogger = new User({
      username: 'blogger',
      email: 'blogger@example.com',
      password: await hashPassword('password123'),
      role: 'user'
    });

    await reader.save();
    await blogger.save();

    console.log('Seed users created: reader@example.com / blogger@example.com (password: password123)');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

run();
