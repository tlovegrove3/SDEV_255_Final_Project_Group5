const express = require("express");
const router = express.Router();
const Teacher = require("../models/teachers");

router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("createdCourses")
      .select("-password"); // Don't send passwords

    res.json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/teachers - Create new teacher (for Stage 2)
router.post("/", async (req, res) => {
  try {
    const { name, email, teacherId, password, department } = req.body;

    if (!name || !email || !teacherId || !password || !department) {
      return res.status(400).json({
        success: false,
        error:
          "All fields are required: name, email, teacherId, password, department",
      });
    }

    const newTeacher = new Teacher({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      teacherId: teacherId.trim(),
      password, // TODO: Hash this later
      department: department.trim(),
    });

    const savedTeacher = await newTeacher.save();

    // Don't send password back
    const teacherResponse = savedTeacher.toObject();
    delete teacherResponse.password;

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: teacherResponse,
    });
  } catch (error) {
    console.error("Error creating teacher:", error);
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: "Teacher ID or email already exists",
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
