import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";

const Navigation = () => {
  const { user, isAuthenticated, getRole, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleNavigation = (hash) => {
    window.location.hash = hash;
  };

  return (
    <>
      {/* Top Header */}
      <header className="top-header">
        <h1>University Course Manager</h1>
      </header>

      {/* Sidebar Navigation */}
      {isAuthenticated() ? (
        <nav className="sidebar">
          <div className="sidebar-header">
            <div className="theme-section">
              <span className="theme-label">Theme</span>
              <button
                className={`theme-toggle ${isDark ? "dark" : ""}`}
                onClick={toggleTheme}
                title={`Switch to ${isDark ? "light" : "dark"} mode`}
              />
            </div>
          </div>

          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">({getRole()})</span>
          </div>

          <div className="nav-links">
            <button onClick={() => handleNavigation("#/")}>Home</button>

            {getRole() === "student" ? (
              <>
                <button onClick={() => handleNavigation("#/courses")}>
                  All Courses
                </button>
                <button onClick={() => handleNavigation("#/my-courses")}>
                  My Courses
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleNavigation("#/courses")}>
                  All Courses
                </button>
                <button onClick={() => handleNavigation("#/add-course")}>
                  Create Course
                </button>
              </>
            )}

            <button
              onClick={logout}
              className="logout-btn"
            >
              Logout
            </button>
          </div>

          <div className="sidebar-footer">
            <div className="sidebar-date">
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </nav>
      ) : (
        <nav className="sidebar">
          <div className="sidebar-header">
            <div className="theme-section">
              <span className="theme-label">Theme</span>
              <button
                className={`theme-toggle ${isDark ? "dark" : ""}`}
                onClick={toggleTheme}
                title={`Switch to ${isDark ? "light" : "dark"} mode`}
              />
            </div>
          </div>

          <div className="nav-links">
            <button onClick={() => handleNavigation("#/")}>Home</button>
            <button onClick={() => handleNavigation("#/login")}>Login</button>
            <button onClick={() => handleNavigation("#/register")}>
              Register
            </button>
          </div>

          <div className="sidebar-footer">
            <div className="sidebar-date">
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navigation;
