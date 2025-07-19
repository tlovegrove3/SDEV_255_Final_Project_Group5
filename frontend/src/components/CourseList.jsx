import { useState, useEffect } from "react";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // You can make this configurable later
  // const API_BASE_URL = "http://localhost:3000/api";
  const API_BASE_URL = "https://sdev-255-final-project-group5.onrender.com/api";

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/courses`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch courses");
      }

      // Backend now returns { success: true, data: courses }
      setCourses(result.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete course");
      }

      // Remove the course from local state
      setCourses(courses.filter((course) => course._id !== courseId));
      alert("Course deleted successfully! ✅");
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Error deleting course: " + err.message);
    }
  };

  // Render loading state, error state, or course list
  if (loading) {
    return (
      <div className="loading">
        <h2>📚 Loading courses...</h2>
        <p>Please wait while we fetch the latest course information.</p>
      </div>
    );
  }

  // If there's an error, show it
  if (error) {
    return (
      <div className="error">
        <h2>❌ Error Loading Courses</h2>
        <p>{error}</p>
        <button
          onClick={fetchCourses}
          className="retry-btn"
        >
          Try Again
        </button>
      </div>
    );
  }

  // If no courses, show empty state
  return (
    <div className="course-list">
      <div className="page-header">
        <h1>📚 Available Courses</h1>
        <p>
          Total courses: <strong>{courses.length}</strong>
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <h3>📝 No courses available yet</h3>
          <p>Add some courses to get started!</p>
          <button
            onClick={() => (window.location.hash = "add")}
            className="cta-btn"
          >
            Add Your First Course
          </button>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div
              key={course._id}
              className="course-card"
            >
              <div className="course-header">
                <h3>{course.cname}</h3>
                <span className="course-code">{course.code}</span>
              </div>

              <div className="course-info">
                <p>
                  <strong>📊 Credits:</strong> {course.credits}
                </p>
                <p>
                  <strong>🎓 Subject:</strong> {course.subject_area}
                </p>
                <p>
                  <strong>📋 Description:</strong> {course.description}
                </p>
              </div>

              <div className="course-meta">
                <small>
                  Created: {new Date(course.createdAt).toLocaleDateString()}
                </small>
              </div>

              <div className="course-actions">
                <button
                  onClick={() => deleteCourse(course._id)}
                  className="delete-btn"
                >
                  🗑️ Delete Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;
