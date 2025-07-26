function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Streamline Your Academic Journey</h1>
          <p className="hero-description">
            A modern platform for managing university courses with role-based
            access for students and teachers.
            <br /> Browse courses, manage enrollments, and track your academic
            progress.
          </p>

          <div className="quick-actions">
            <button
              className="cta-button primary"
              onClick={() => (window.location.hash = "#/courses")}
            >
              Browse Courses
            </button>
            <br />
          </div>
          <h1>Features</h1>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">📚</span>
            <h3 className="feature-title">Course Management</h3>
            <p className="feature-description">
              Browse and manage courses with detailed information including
              credits, descriptions, and prerequisites.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">👥</span>
            <h3 className="feature-title">Role-Based Access</h3>
            <p className="feature-description">
              Separate interfaces for students and teachers with appropriate
              permissions and functionality.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🔐</span>
            <h3 className="feature-title">Secure Authentication</h3>
            <p className="feature-description">
              JWT-based authentication system with password hashing and secure
              session management.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">📱</span>
            <h3 className="feature-title">Modern Interface</h3>
            <p className="feature-description">
              Clean, responsive design with dark/light theme support and
              intuitive navigation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
