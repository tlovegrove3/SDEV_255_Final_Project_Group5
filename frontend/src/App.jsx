// import { useState } from "react";
import CourseDetail from "./components/CourseDetail.jsx";
import { useHash, parseHash } from "./hooks/useHash";
import Home from "./components/Home.jsx";
import CourseList from "./components/CourseList.jsx";
import AddCourse from "./components/AddCourse.jsx";
import "./App.css";

function App() {
  const { hash, navigate } = useHash();
  const { page, id } = parseHash(hash);

  return (
    <div className="App">
      <nav className="navbar">
        <h2>🎓 University Course Manager</h2>
        <div className="nav-links">
          <button
            onClick={() => navigate("/home")}
            className={page === "home" ? "active" : ""}
          >
            🏠 Home
          </button>
          <button
            onClick={() => navigate("/courses")}
            className={page === "courses" ? "active" : ""}
          >
            📚 Courses
          </button>
          <button
            onClick={() => navigate("/add-course")}
            className={page === "add-course" ? "active" : ""}
          >
            ➕ Add Course
          </button>
        </div>
      </nav>

      <main className="main-content">
        {page === "home" && <Home />}
        {page === "courses" && id && <CourseDetail courseId={id} />}
        {page === "courses" && !id && <CourseList />}
        {page === "add-course" && <AddCourse />}
      </main>
    </div>
  );
}

export default App;
