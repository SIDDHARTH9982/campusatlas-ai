const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    // Try standard connection first
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Local MongoDB connection failed. Falling back to mongodb-memory-server...');
      try {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const conn = await mongoose.connect(uri);
        console.log(`In-memory MongoDB started and connected: ${conn.connection.host}`);
      } catch (memError) {
        console.error('Failed to start in-memory MongoDB:', memError.message);
        process.exit(1);
      }
    } else {
      console.error('MongoDB connection error:', error.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
