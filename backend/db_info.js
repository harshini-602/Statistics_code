require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blogify';

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;
    console.log('Connected to', db.databaseName);
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    const users = await User.find().select('-password').lean();
    console.log('Users count:', users.length);
    console.log('Users:', users);
    await mongoose.disconnect();
  } catch (err) {
    console.error('DB info error:', err);
    process.exit(1);
  }
}

run();
