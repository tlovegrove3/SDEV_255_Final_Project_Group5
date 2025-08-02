const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/database");

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/students", require("./routes/students"));
app.use("/api/teachers", require("./routes/teachers"));
app.use("/api/cart", require("./routes/shoppingCart"));

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "University Course Manager API is running! 🚀",
    version: "1.0.0",
    status: "healthy",
    endpoints: {
      auth: "/api/auth",
      courses: "/api/courses",
      students: "/api/students",
      teachers: "/api/teachers",
      cart: "/api/cart",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    availableRoutes: ["/api/auth", "/api/courses", "/api/students", "/api/teachers", "/api/cart"],
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}`);
});
