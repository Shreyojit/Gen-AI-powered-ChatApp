import mongoose from 'mongoose';

async function dbConnect() {
  // Ensure MONGO_URI is set
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set.');
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');

    // You can return the mongoose connection if needed elsewhere
   
  } catch (error) {
    // Handle unknown errors
    if (error instanceof Error) {
      console.error('Database connection failed:', error.message);
      throw new Error(`Database connection failed: ${error.message}`);
    } else {
      console.error('Database connection failed with an unknown error.');
      throw new Error('Database connection failed with an unknown error.');
    }
  }
}

export default dbConnect;