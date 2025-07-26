import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { apiConfig } from "../config/api";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await apiConfig.fetchWithAuth("/students/my-courses");
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const dropCourse = async (courseId) => {
    if (!confirm("Are you sure you want to drop this course?")) return;

    try {
      const response = await apiConfig.fetchWithAuth(
        `/students/enroll/${courseId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.success) {
        fetchMyCourses(); // Refresh list
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error dropping course:", error);
    }
  };

  if (loading) return <div>Loading your courses...</div>;

  return (
    <div className="my-courses">
      <h2>My Enrolled Courses</h2>

      {courses.length === 0 ? (
        <div>
          <p>You're not enrolled in any courses yet.</p>
          <button onClick={() => (window.location.hash = "#/courses")}>
            Browse Available Courses
          </button>
        </div>
      ) : (
        <div className="courses-list">
          {courses.map((course) => (
            <div
              key={course._id}
              className="course-item"
            >
              <h3>
                {course.code}: {course.cname}
              </h3>
              <p>{course.description}</p>
              <p>
                <strong>Subject:</strong> {course.subject_area}
              </p>
              <p>
                <strong>Credits:</strong> {course.credits}
              </p>
              <div className="course-actions">
                <button
                  onClick={() =>
                    (window.location.hash = `#/courses/${course._id}`)
                  }
                >
                  View Details
                </button>
                <button
                  onClick={() => dropCourse(course._id)}
                  className="drop-btn"
                >
                  Drop Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
