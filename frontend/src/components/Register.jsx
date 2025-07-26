import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { apiConfig } from "../config/api";

const Register = () => {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    teacherId: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const registerData = {
      role,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      ...(role === "student"
        ? { studentId: formData.studentId }
        : { teacherId: formData.teacherId, department: formData.department }),
    };

    try {
      await register(registerData);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

      {/* Role Selection */}
      <div className="role-selection">
        <label>
          <input
            type="radio"
            value="student"
            checked={role === "student"}
            onChange={(e) => setRole(e.target.value)}
          />
          Student
        </label>
        <label>
          <input
            type="radio"
            value="teacher"
            checked={role === "teacher"}
            onChange={(e) => setRole(e.target.value)}
          />
          Teacher
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        {/* Dynamic fields based on role */}
        {role === "student" ? (
          <input
            type="text"
            placeholder="Student ID"
            value={formData.studentId}
            onChange={(e) =>
              setFormData({ ...formData, studentId: e.target.value })
            }
            required
          />
        ) : (
          <>
            <input
              type="text"
              placeholder="Teacher ID"
              value={formData.teacherId}
              onChange={(e) =>
                setFormData({ ...formData, teacherId: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              required
            />
          </>
        )}

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          minLength={6}
          required
        />

        {error && <div className="error">{error}</div>}
        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Registering..." : `Register as ${role}`}
        </button>
      </form>
    </div>
  );
};

export default Register;
