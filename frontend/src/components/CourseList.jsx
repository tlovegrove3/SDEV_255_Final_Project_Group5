import { useState, useEffect } from "react";
import { useHash } from "../hooks/useHash";
import { apiConfig } from "../config/api";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { navigate } = useHash();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await apiConfig.fetchPublic("/courses");
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
        <h1>📚 Available Courses</h1>
        <p>
          Total courses: <strong>{courses.length}</strong>
        </p>
        <button
          onClick={() => navigate("/add-course")}
          className="add-btn"
        >
          ➕ Add New Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <h3>📝 No courses available yet</h3>
          <p>Add some courses to get started!</p>
          <button
            onClick={() => navigate("/add-course")}
            className="cta-btn"
          >
            Add Your First Course
          </button>
        </div>
      ) : (
        <div className="course-list-simple">
          <table className="courses-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
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
