require("dotenv").config();
const { connectDB, mongoose } = require("./config/database");
const Course = require("./models/courses");

async function testConnection() {
  try {
    console.log("🔌 Testing database connection...");

    // Connect to database
    await connectDB();

    // Test creating a sample course
    console.log("📝 Creating test course...");
    const testCourse = new Course({
      cname: "Database Connection Test",
      code: "TEST101",
      description: "This course verifies our database connection is working",
      subject_area: "Computer Science",
      credits: 3,
    });

    await testCourse.save();
    console.log("✅ Test course created:", testCourse.code);

    // Test finding the course
    const foundCourse = await Course.findOne({ code: "TEST101" });
    console.log("✅ Test course retrieved:", foundCourse.cname);

    // Test updating the course
    foundCourse.description = "Updated test description";
    await foundCourse.save();
    console.log("✅ Test course updated");

    // Clean up - delete the test course
    await Course.deleteOne({ code: "TEST101" });
    console.log("✅ Test course cleaned up");

    console.log("🎉 All database operations successful!");
    console.log("💾 Your database connection is working perfectly!");
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    console.error("🔧 Check your MONGODB_URI in the .env file");
  } finally {
    await mongoose.connection.close();
    console.log("🔐 Database connection closed");
    process.exit(0);
  }
}

testConnection();
