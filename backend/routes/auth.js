const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Student = require("../models/students");
const Teacher = require("../models/teachers");

// Helper function to generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

// POST /api/auth/register - Register new user (student or teacher)
router.post("/register", async (req, res) => {
  try {
    const { role, name, email, password, studentId, teacherId, department } = req.body;

    // Validate role
    if (!role || !["student", "teacher"].includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Role must be either 'student' or 'teacher'"
      });
    }

    // Validate common fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required"
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long"
      });
    }

    let newUser;
    let userResponse;

    if (role === "student") {
      // Validate student-specific fields
      if (!studentId) {
        return res.status(400).json({
          success: false,
          error: "Student ID is required for student registration"
        });
      }

      // Create new student
      newUser = new Student({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        studentId: studentId.trim(),
        password
      });

      const savedStudent = await newUser.save();
      userResponse = savedStudent.toObject();
      delete userResponse.password;

    } else if (role === "teacher") {
      // Validate teacher-specific fields
      if (!teacherId || !department) {
        return res.status(400).json({
          success: false,
          error: "Teacher ID and department are required for teacher registration"
        });
      }

      // Create new teacher
      newUser = new Teacher({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        teacherId: teacherId.trim(),
        password,
        department: department.trim()
      });

      const savedTeacher = await newUser.save();
      userResponse = savedTeacher.toObject();
      delete userResponse.password;
    }

    // Generate JWT token
    const token = generateToken(newUser._id, role);

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      data: {
        user: userResponse,
        token,
        role
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }

    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/auth/login - Unified login for students and teachers
router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        error: "User ID and password are required"
      });
    }

    let user = null;
    let role = null;

    // First, try to find as student
    user = await Student.findOne({ studentId: userId });
    if (user) {
      role = "student";
    } else {
      // If not found as student, try to find as teacher
      user = await Teacher.findOne({ teacherId: userId });
      if (user) {
        role = "teacher";
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, role);

    // Prepare user response (without password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: userResponse,
        token,
        role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed. Please try again."
    });
  }
});

module.exports = router;