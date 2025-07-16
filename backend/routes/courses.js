const express = require("express");
const router = express.Router();
const Course = require("../models/courses");

// GET /api/courses - Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/courses/:id - Get single course
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }
    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/courses - Create new course
router.post("/", async (req, res) => {
  try {
    const { cname, code, description, subject_area, credits } = req.body;

    // Basic validation
    if (!cname || !code || !description || !subject_area || !credits) {
      return res.status(400).json({
        success: false,
        error:
          "All fields are required: cname, code, description, subject_area, credits",
      });
    }

    const newCourse = new Course({
      cname: cname.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      subject_area: subject_area.trim(),
      credits: parseInt(credits),
    });

    const savedCourse = await newCourse.save();
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: savedCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: "Course code already exists",
      });
    } else if (error.name === "ValidationError") {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to create course",
      });
    }
  }
});

// PUT /api/courses/:id - Update course
router.put("/:id", async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/courses/:id - Delete course
router.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    res.json({
      success: true,
      message: "Course deleted successfully",
      data: deletedCourse,
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
