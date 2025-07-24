const express = require("express");
const router = express.Router();
const Student = require("../models/students");
const Course = require("../models/courses");
const { authenticate, requireStudent } = require("../middleware/auth");

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

// POST /api/students/enroll - Enroll student in a course
router.post("/enroll", authenticate, requireStudent, async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        error: "Course ID is required"
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found"
      });
    }

    // Get current student
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found"
      });
    }

    // Check if already enrolled
    if (student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        error: "Already enrolled in this course"
      });
    }

    // Add course to student's enrolled courses
    student.enrolledCourses.push(courseId);
    student.updatedAt = Date.now();
    await student.save();

    // Get updated student with populated courses
    const updatedStudent = await Student.findById(req.user.id)
      .populate("enrolledCourses")
      .select("-password");

    res.json({
      success: true,
      message: "Successfully enrolled in course",
      data: {
        student: updatedStudent,
        course: course
      }
    });

  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to enroll in course"
    });
  }
});

// DELETE /api/students/enroll/:courseId - Drop/unenroll from a course
router.delete("/enroll/:courseId", authenticate, requireStudent, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found"
      });
    }

    // Get current student
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found"
      });
    }

    // Check if enrolled in course
    if (!student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        error: "Not enrolled in this course"
      });
    }

    // Remove course from student's enrolled courses
    student.enrolledCourses = student.enrolledCourses.filter(
      id => id.toString() !== courseId
    );
    student.updatedAt = Date.now();
    await student.save();

    // Get updated student with populated courses
    const updatedStudent = await Student.findById(req.user.id)
      .populate("enrolledCourses")
      .select("-password");

    res.json({
      success: true,
      message: "Successfully dropped course",
      data: {
        student: updatedStudent,
        droppedCourse: course
      }
    });

  } catch (error) {
    console.error("Drop course error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to drop course"
    });
  }
});

// GET /api/students/my-courses - Get current student's enrolled courses
router.get("/my-courses", authenticate, requireStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .populate("enrolledCourses")
      .select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found"
      });
    }

    res.json({
      success: true,
      count: student.enrolledCourses.length,
      data: student.enrolledCourses
    });

  } catch (error) {
    console.error("Get enrolled courses error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get enrolled courses"
    });
  }
});

module.exports = router;
