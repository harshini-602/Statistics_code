const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI ;

// Connect to MongoDB
if (!MONGO_URI) {
  console.warn('MONGO_URI not set in environment. MongoDB connection skipped.');
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Middleware
const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (origin === frontendOrigin) return callback(null, true);
    return callback(new Error('CORS policy: This origin is not allowed'), false);
  },
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Routes
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');
const commentRoutes = require('./routes/comment');
const dashboardRoutes = require('./routes/dashboard'); // Add this line

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/dashboard', dashboardRoutes); // Add this line

app.get('/', (req, res) => res.send('Blogify Backend'));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Generic error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err && err.message) {
    return res.status(err.status || 500).json({ message: err.message, errors: err.errors || undefined });
  }
  return res.status(500).json({ message: 'Server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
