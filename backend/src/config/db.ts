import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('\n⚠️ [WARN] MONGODB_URI is not set in environment variables.');
    console.warn('⚠️ [WARN] The backend will run with a mock database fallback. Connect MongoDB Atlas for actual database persistence.\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error instanceof Error ? error.message : error}`);
    console.warn('⚠️ [WARN] Falling back to simulated database storage.');
    return false;
  }
};
