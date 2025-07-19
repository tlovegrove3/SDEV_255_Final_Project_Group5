require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Get URI from environment variable, with fallback error message
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error(
        "MONGODB_URI environment variable is not set. Please check your .env file."
      );
    }

    await mongoose.connect(uri, {
      dbName: process.env.DB_NAME,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("💡 Make sure your .env file has MONGODB_URI set correctly");
    process.exit(1);
  }
};

module.exports = { connectDB, mongoose };
