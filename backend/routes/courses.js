const express = require("express");
const router = express.Router();
const Course = require("../models/courses");
const { authenticate, requireTeacher } = require("../middleware/auth");

// GET /api/courses - Get all courses (filtered by availability for students)
router.get("/", async (req, res) => {
  try {
    let filter = {};
    
    // If request includes student role filter, only show available courses
    if (req.query.role === 'student') {
      filter.isAvailable = true;
    }
    
    const courses = await Course.find(filter)
      .populate('createdBy', 'name teacherId')
      .sort({ createdAt: -1 });
      
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
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'name teacherId');
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

// POST /api/courses - Create new course (Teachers only)
router.post("/", authenticate, requireTeacher, async (req, res) => {
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
      createdBy: req.user._id,
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

// PUT /api/courses/:id - Update course (Only course creator)
router.put("/:id", authenticate, requireTeacher, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    // Check if the authenticated teacher created this course
    if (course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Only the course creator can edit this course",
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

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

// DELETE /api/courses/:id - Delete course (Only course creator)
router.delete("/:id", authenticate, requireTeacher, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    // Check if the authenticated teacher created this course
    if (course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Only the course creator can delete this course",
      });
    }

    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

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

// PATCH /api/courses/:id/availability - Toggle course availability (Only course creator)
router.patch("/:id/availability", authenticate, requireTeacher, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    // Check if the authenticated teacher created this course
    if (course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Only the course creator can modify course availability",
      });
    }

    // Toggle availability
    course.isAvailable = !course.isAvailable;
    course.updatedAt = Date.now();
    
    const updatedCourse = await course.save();

    res.json({
      success: true,
      message: `Course ${updatedCourse.isAvailable ? 'made available' : 'hidden from'} students`,
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error toggling course availability:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
