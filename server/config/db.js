import mongoose from "mongoose";

// MongoDB connection helper
// Used in server.js as: import connectDB from "./config/db.js";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 7+ uses sensible defaults; override here if needed
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;


