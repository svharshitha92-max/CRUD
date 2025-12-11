const express = require('express');
const mongoose = require('mongoose');
const studentRoutes = require('./roots/studentrouts');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/students', studentRoutes);

// Serve static files from public directory
app.use(express.static('public'));

// Connection status endpoint
app.get('/api/connection-status', (req, res) => {
  res.json({ 
    connected: mongoose.connection.readyState === 1,
    usingInMemory: typeof global.students !== 'undefined'
  });
});

// Connect to MongoDB with timeout
const connectToMongoDB = async () => {
  try {
    // Try to connect to MongoDB Atlas (you need to replace with your own connection string)
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studentdb';
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 10s
    });
    console.log('Connected to MongoDB');
    return true;
  } catch (err) {
    console.error('Database connection error:', err.message);
    return false;
  }
};

// Initialize storage
const initializeStorage = async () => {
  const isConnected = await connectToMongoDB();
  
  if (isConnected) {
    // Using MongoDB
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} with MongoDB storage`);
      console.log(`Visit http://localhost:${PORT} in your browser`);
    });
  } else {
    // Fallback to in-memory storage
    console.log('Using in-memory storage as fallback');
    console.log('To connect to MongoDB:');
    console.log('1. Install MongoDB locally or sign up for MongoDB Atlas');
    console.log('2. Set the MONGODB_URI environment variable');
    console.log('3. Restart the server');
    global.students = [];
    global.nextId = 1;
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} with in-memory storage`);
      console.log(`Visit http://localhost:${PORT} in your browser`);
    });
  }
};

initializeStorage();