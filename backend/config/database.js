require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGODB_URI ||
      "mongodb+srv://tlovegrove3:rt8oXzdaVQDKC26s@sdev255-final.atk7y5y.mongodb.net/?retryWrites=true&w=majority&appName=SDEV255-Final";

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, mongoose };
