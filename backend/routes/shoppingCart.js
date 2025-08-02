const express = require("express");
const router = express.Router();
const ShoppingCart = require("../models/shoppingCart");
const Student = require("../models/students");
const Course = require("../models/courses");
const { authenticate, requireStudent } = require("../middleware/auth");

// GET /api/cart - Get current student's shopping cart
router.get("/", authenticate, requireStudent, async (req, res) => {
  try {
    let cart = await ShoppingCart.findOne({ studentId: req.user.id })
      .populate("courses")
      .populate("studentId", "name email studentId");

    if (!cart) {
      cart = new ShoppingCart({
        studentId: req.user.id,
        courses: []
      });
      await cart.save();
    }

    res.json({
      success: true,
      count: cart.courses.length,
      data: cart
    });

  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get shopping cart"
    });
  }
});

// POST /api/cart/add - Add course to shopping cart
router.post("/add", authenticate, requireStudent, async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        error: "Course ID is required"
      });
    }

    // Check if course exists and is available
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found"
      });
    }

    if (!course.isAvailable) {
      return res.status(400).json({
        success: false,
        error: "Course is not available for enrollment"
      });
    }

    // Check if student is already enrolled
    const student = await Student.findById(req.user.id);
    if (student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        error: "Already enrolled in this course"
      });
    }

    // Get or create shopping cart
    let cart = await ShoppingCart.findOne({ studentId: req.user.id });
    if (!cart) {
      cart = new ShoppingCart({
        studentId: req.user.id,
        courses: []
      });
    }

    // Check if course is already in cart
    if (cart.courses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        error: "Course is already in your cart"
      });
    }

    // Add course to cart
    cart.courses.push(courseId);
    await cart.save();

    // Get updated cart with populated courses
    const updatedCart = await ShoppingCart.findById(cart._id)
      .populate("courses")
      .populate("studentId", "name email studentId");

    res.json({
      success: true,
      message: "Course added to cart successfully",
      data: updatedCart
    });

  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add course to cart"
    });
  }
});

// DELETE /api/cart/:courseId - Remove course from shopping cart
router.delete("/:courseId", authenticate, requireStudent, async (req, res) => {
  try {
    const { courseId } = req.params;

    const cart = await ShoppingCart.findOne({ studentId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Shopping cart not found"
      });
    }

    // Check if course is in cart
    if (!cart.courses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        error: "Course is not in your cart"
      });
    }

    // Remove course from cart
    cart.courses = cart.courses.filter(
      id => id.toString() !== courseId
    );
    await cart.save();

    // Get updated cart with populated courses
    const updatedCart = await ShoppingCart.findById(cart._id)
      .populate("courses")
      .populate("studentId", "name email studentId");

    res.json({
      success: true,
      message: "Course removed from cart successfully",
      data: updatedCart
    });

  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to remove course from cart"
    });
  }
});

// POST /api/cart/checkout - Convert cart contents to enrollments
router.post("/checkout", authenticate, requireStudent, async (req, res) => {
  try {
    const cart = await ShoppingCart.findOne({ studentId: req.user.id })
      .populate("courses");

    if (!cart || cart.courses.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Cart is empty"
      });
    }

    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found"
      });
    }

    // Check for duplicate enrollments and unavailable courses
    const validCourses = [];
    const errors = [];

    for (const course of cart.courses) {
      if (!course.isAvailable) {
        errors.push(`${course.cname} is no longer available`);
        continue;
      }
      
      if (student.enrolledCourses.includes(course._id)) {
        errors.push(`Already enrolled in ${course.cname}`);
        continue;
      }

      validCourses.push(course._id);
    }

    if (validCourses.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid courses to enroll in",
        details: errors
      });
    }

    // Add valid courses to student's enrolled courses
    student.enrolledCourses.push(...validCourses);
    student.updatedAt = Date.now();
    await student.save();

    // Clear the shopping cart
    cart.courses = [];
    await cart.save();

    // Get updated student with populated courses
    const updatedStudent = await Student.findById(req.user.id)
      .populate("enrolledCourses")
      .select("-password");

    res.json({
      success: true,
      message: `Successfully enrolled in ${validCourses.length} course(s)`,
      data: {
        student: updatedStudent,
        enrolledCount: validCourses.length,
        errors: errors.length > 0 ? errors : null
      }
    });

  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to complete checkout"
    });
  }
});

// DELETE /api/cart/clear - Clear entire shopping cart
router.delete("/clear", authenticate, requireStudent, async (req, res) => {
  try {
    const cart = await ShoppingCart.findOne({ studentId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Shopping cart not found"
      });
    }

    cart.courses = [];
    await cart.save();

    res.json({
      success: true,
      message: "Shopping cart cleared successfully",
      data: cart
    });

  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to clear shopping cart"
    });
  }
});

module.exports = router;