const express = require("express");
const router = express.Router();
const Student = require("../models/students");

// GET /api/students - Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find()
      .populate("enrolledCourses")
      .select("-password"); // Don't send passwords

    res.json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/students - Create new student (for Stage 2)
router.post("/", async (req, res) => {
  try {
    const { name, email, studentId, password } = req.body;

    if (!name || !email || !studentId || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields are required: name, email, studentId, password",
      });
    }

    const newStudent = new Student({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      studentId: studentId.trim(),
      password, // TODO: Hash this later
    });

    const savedStudent = await newStudent.save();

    // Don't send password back
    const studentResponse = savedStudent.toObject();
    delete studentResponse.password;

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: studentResponse,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: "Student ID or email already exists",
      });
    } else {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
});

module.exports = router;
