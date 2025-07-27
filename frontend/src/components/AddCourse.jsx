import { useState } from "react";
import { apiConfig } from "../config/api";
import { useAuth } from "../hooks/useAuth";

function AddCourse() {
  const [courseData, setCourseData] = useState({
    cname: "",
    code: "",
    description: "",
    subject_area: "",
    credits: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear any previous messages when user starts typing
    if (message.text) {
      setMessage({ text: "", type: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await apiConfig.fetchWithAuth("/courses", {
        method: "POST",
        body: JSON.stringify({
          ...courseData,
          credits: parseInt(courseData.credits),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create course");
      }

      setMessage({
        text: `Course "${result.data.cname}" created successfully! 🎉`,
        type: "success",
      });

      // Reset form
      setCourseData({
        cname: "",
        code: "",
        description: "",
        subject_area: "",
        credits: "",
      });

      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
    } catch (err) {
      console.error("Error creating course:", err);
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-course">
      <div className="page-header">
        <h2>➕ Add New Course</h2>
        <p>Fill out the form below to create a new course</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="course-form"
      >
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cname">
              📚 Course Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="cname"
              name="cname"
              value={courseData.cname}
              onChange={handleChange}
              placeholder="e.g., Introduction to Computer Science"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="code">
              🏷️ Course Code <span className="required">*</span>
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={courseData.code}
              onChange={handleChange}
              placeholder="e.g., CS101"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="subject_area">
              🎓 Subject Area <span className="required">*</span>
            </label>
            <input
              type="text"
              id="subject_area"
              name="subject_area"
              value={courseData.subject_area}
              onChange={handleChange}
              placeholder="e.g., Computer Science"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="credits">
              📊 Credits <span className="required">*</span>
            </label>
            <select
              id="credits"
              name="credits"
              value={courseData.credits}
              onChange={handleChange}
              required
            >
              <option value="">Select credits</option>
              <option value="1">1 Credit</option>
              <option value="2">2 Credits</option>
              <option value="3">3 Credits</option>
              <option value="4">4 Credits</option>
              <option value="5">5 Credits</option>
              <option value="6">6 Credits</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">
            📋 Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={courseData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Provide a detailed description of the course content, objectives, and prerequisites..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading ? <>⏳ Creating Course...</> : <>✨ Create Course</>}
        </button>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
      </form>
    </div>
  );
}

export default AddCourse;
