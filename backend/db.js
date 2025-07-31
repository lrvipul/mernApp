const mongoose = require('mongoose');
const mongoUri = "mongodb://localhost:27017/?readPreference=primary&directConnection=true";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Optional: Exit process on failure
  }
};

module.exports = connectToMongo;
