import { useState, useEffect } from "react";
import { useHash } from "../hooks/useHash";
import { apiConfig } from "../config/api";
import { useAuth } from "../hooks/useAuth";

function CourseDetail({ courseId }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const { navigate } = useHash();
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const { isAuthenticated, getRole, user } = useAuth();
  const role = getRole();
  
  // Check if current user is the course creator
  const isCreator = course && user && course.createdBy && 
                   course.createdBy._id === user._id;

  const checkEnrollmentStatus = async () => {
    if (role === "student" && isAuthenticated()) {
      try {
        const response = await apiConfig.fetchWithAuth("/students/my-courses");
        const data = await response.json();
        if (data.success) {
          const enrolled = data.data.some((course) => course._id === courseId);
          setIsEnrolled(enrolled);
        }
      } catch (error) {
        console.error("Error checking enrollment:", error);
      }
    }
  };

  const enrollInCourse = async () => {
    try {
      const response = await apiConfig.fetchWithAuth("/students/enroll", {
        method: "POST",
        body: JSON.stringify({ courseId }),
      });
      const data = await response.json();

      if (data.success) {
        setIsEnrolled(true);
        setEnrollmentStatus("Successfully enrolled!");
      } else {
        setEnrollmentStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setEnrollmentStatus("Enrollment failed");
    }
  };

  const dropCourse = async () => {
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
        setIsEnrolled(false);
        setEnrollmentStatus("Successfully dropped course");
      } else {
        setEnrollmentStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setEnrollmentStatus("Failed to drop course");
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      checkEnrollmentStatus();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await apiConfig.fetchPublic(`/courses/${courseId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch course");
      }

      setCourse(result.data);
      setEditData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConfig.fetchWithAuth(`/courses/${courseId}`, {
        method: "PUT",
        body: JSON.stringify(editData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update course");
      }

      setCourse(result.data);
      setIsEditing(false);
      alert("Course updated successfully! ✅");
    } catch (err) {
      alert("Error updating course: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await apiConfig.fetchWithAuth(`/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete course");
      }

      alert("Course deleted successfully! ✅");
      navigate("/courses"); // Return to course list
    } catch (err) {
      alert("Error deleting course: " + err.message);
    }
  };

  const toggleAvailability = async () => {
    try {
      setAvailabilityLoading(true);
      const response = await apiConfig.toggleCourseAvailability(courseId);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to toggle availability");
      }

      // Update the course state with new availability
      setCourse(prev => ({ ...prev, isAvailable: result.data.isAvailable }));
      setEnrollmentStatus(result.message);
    } catch (err) {
      setEnrollmentStatus("Error toggling availability: " + err.message);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  if (loading) return <div className="loading">📚 Loading course...</div>;
  if (error) return <div className="error">❌ Error: {error}</div>;
  if (!course) return <div className="error">❌ Course not found</div>;

  return (
    <div className="course-detail">
      <div className="page-header">
        <button
          onClick={() => navigate("/courses")}
          className="back-btn"
        >
          ← Back to Courses
        </button>
        <h2>📚 Course Details</h2>
      </div>

      {!isEditing ? (
        // View Mode
        <div className="course-info-card">
          <div className="course-header">
            <h2>{course.cname}</h2>
            <span className="course-code">{course.code}</span>
          </div>

          <div className="course-details">
            <p>
              <strong>📊 Credits:</strong> {course.credits}
            </p>
            <p>
              <strong>🎓 Subject Area:</strong> {course.subject_area}
            </p>
            <p>
              <strong>📋 Description:</strong> {course.description}
            </p>
            <p>
              <strong>📅 Created:</strong>{" "}
              {new Date(course.createdAt).toLocaleDateString()}
            </p>
            {course.createdBy && (
              <p>
                <strong>👨‍🏫 Created by:</strong>{" "}
                {course.createdBy.name} ({course.createdBy.teacherId})
              </p>
            )}
            {role === "teacher" && (
              <p>
                <strong>👁️ Availability:</strong>{" "}
                <span className={`availability-status ${course.isAvailable ? 'available' : 'hidden'}`}>
                  {course.isAvailable ? "Visible to students" : "Hidden from students"}
                </span>
              </p>
            )}
          </div>
          {isAuthenticated() && (
            <div className="course-actions">
              {role === "student" && (
                <div>
                  {isEnrolled ? (
                    <button
                      onClick={dropCourse}
                      className="drop-btn"
                    >
                      Drop Course
                    </button>
                  ) : (
                    <button
                      onClick={enrollInCourse}
                      className="enroll-btn"
                    >
                      Enroll in Course
                    </button>
                  )}
                </div>
              )}

              {role === "teacher" && (
                <div className="teacher-actions">
                  {isCreator ? (
                    <>
                      <button onClick={() => setIsEditing(true)}>
                        Edit Course
                      </button>
                      <button
                        onClick={toggleAvailability}
                        className={`availability-btn ${course.isAvailable ? 'hide-btn' : 'show-btn'}`}
                        disabled={availabilityLoading}
                      >
                        {availabilityLoading 
                          ? "⏳ Updating..." 
                          : course.isAvailable 
                            ? "👁️‍🗨️ Hide from Students" 
                            : "👁️ Show to Students"
                        }
                      </button>
                      <button
                        onClick={handleDelete}
                        className="delete-btn"
                      >
                        Delete Course
                      </button>
                    </>
                  ) : (
                    <div className="not-creator-message">
                      <p>🔒 Only the course creator can edit or delete this course.</p>
                    </div>
                  )}
                </div>
              )}

              {enrollmentStatus && (
                <div className="status-message">{enrollmentStatus}</div>
              )}
            </div>
          )}

          {/* <div className="course-actions">
            <button
              onClick={() => setIsEditing(true)}
              className="edit-btn"
            >
              ✏️ Edit Course
            </button>
            <button
              onClick={handleDelete}
              className="delete-btn"
            >
              🗑️ Delete Course
            </button>
          </div> */}
        </div>
      ) : (
        // Edit Mode
        <form
          onSubmit={handleEdit}
          className="edit-form"
        >
          <h3>✏️ Edit Course</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Course Name:</label>
              <input
                type="text"
                value={editData.cname || ""}
                onChange={(e) =>
                  setEditData({ ...editData, cname: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Course Code:</label>
              <input
                type="text"
                value={editData.code || ""}
                onChange={(e) =>
                  setEditData({ ...editData, code: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Subject Area:</label>
              <input
                type="text"
                value={editData.subject_area || ""}
                onChange={(e) =>
                  setEditData({ ...editData, subject_area: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Credits:</label>
              <select
                value={editData.credits || ""}
                onChange={(e) =>
                  setEditData({ ...editData, credits: e.target.value })
                }
                required
              >
                <option value="">Select credits</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option
                    key={n}
                    value={n}
                  >
                    {n} Credit{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={editData.description || ""}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              rows="4"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="save-btn"
            >
              💾 Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cancel-btn"
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CourseDetail;
