import { useState, useEffect } from "react";
import { useHash } from "../hooks/useHash";
import { apiConfig } from "../config/api";
import { useAuth } from "../hooks/useAuth";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { navigate } = useHash();
  const { isAuthenticated, getRole } = useAuth();
  const role = getRole();

  useEffect(() => {
    fetchCourses();
  }, [role]); // Re-fetch when role changes

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Build URL with role filter for students
      let endpoint = "/courses";
      if (role === "student") {
        endpoint += "?role=student";
      }
      
      const response = await apiConfig.fetchPublic(endpoint);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch courses");
      }

      setCourses(result.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>📚 Loading courses...</h2>
        <p>Please wait while we fetch the latest course information.</p>
      </div>
    );
  }

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

  return (
    <div className="course-list">
      <div className="page-header">
        <h2>📚 {role === "student" ? "Available Courses" : "All Courses"}</h2>
        <h3>Click on a course to view details and additional actions.</h3>
        <p>
          Total courses: <strong>{courses.length}</strong>
          {role === "student" && " (showing available courses only)"}
        </p>
        {role === "teacher" && (
          <button
            onClick={() => navigate("/add-course")}
            className="add-btn"
          >
            ➕ Add New Course
          </button>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <h3>📝 No courses available yet</h3>
          <p>
            {role === "student" 
              ? "No courses are currently available for enrollment." 
              : "Add some courses to get started!"
            }
          </p>
          {role === "teacher" && (
            <button
              onClick={() => navigate("/add-course")}
              className="cta-btn"
            >
              Add Your First Course
            </button>
          )}
        </div>
      ) : (
        <div className="course-list-simple">
          <table className="courses-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Credits</th>
                {role === "teacher" && <th>Availability</th>}
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id} className={!course.isAvailable ? 'course-hidden' : ''}>
                  <td>
                    <button
                      onClick={() => navigate(`/courses/${course._id}`)}
                      className="course-link"
                    >
                      {course.code}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/courses/${course._id}`)}
                      className="course-link"
                    >
                      {course.cname}
                    </button>
                  </td>
                  <td>{course.credits}</td>
                  {role === "teacher" && (
                    <td>
                      <span className={`availability-indicator ${course.isAvailable ? 'available' : 'hidden'}`}>
                        {course.isAvailable ? "👁️ Visible" : "👁️‍🗨️ Hidden"}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CourseList;
