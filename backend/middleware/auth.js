const jwt = require("jsonwebtoken");
const Student = require("../models/students");
const Teacher = require("../models/teachers");

// Middleware to verify JWT token and attach user to request
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided or invalid format."
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user based on role
    let user;
    if (decoded.role === "student") {
      user = await Student.findById(decoded.userId).select("-password");
    } else if (decoded.role === "teacher") {
      user = await Teacher.findById(decoded.userId).select("-password");
    } else {
      return res.status(401).json({
        success: false,
        error: "Invalid token role"
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Token valid but user not found"
      });
    }

    // Attach user info to request
    req.user = {
      id: user._id,
      role: decoded.role,
      ...user.toObject()
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token"
      });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expired"
      });
    } else {
      console.error("Auth middleware error:", error);
      return res.status(500).json({
        success: false,
        error: "Authentication error"
      });
    }
  }
};

// Middleware to check if user is a teacher
const requireTeacher = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentication required"
    });
  }

  if (req.user.role !== "teacher") {
    return res.status(403).json({
      success: false,
      error: "Teacher access required"
    });
  }

  next();
};

// Middleware to check if user is a student
const requireStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentication required"
    });
  }

  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      error: "Student access required"
    });
  }

  next();
};

module.exports = {
  authenticate,
  requireTeacher,
  requireStudent
};