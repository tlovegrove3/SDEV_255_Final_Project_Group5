import { useState } from "react";
import Home from "./components/Home.jsx";
import CourseList from "./components/CourseList.jsx";
import AddCourse from "./components/AddCourse.jsx";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="App">
      <nav className="navbar">
        <h2>🎓 University Course Manager</h2>
        <div className="nav-links">
          <button
            onClick={() => setPage("home")}
            className={page === "home" ? "active" : ""}
          >
            🏠 Home
          </button>
          <button
            onClick={() => setPage("courses")}
            className={page === "courses" ? "active" : ""}
          >
            📚 Courses
          </button>
          <button
            onClick={() => setPage("add")}
            className={page === "add" ? "active" : ""}
          >
            ➕ Add Course
          </button>
        </div>
      </nav>

      <main className="main-content">
        {page === "home" && <Home />}
        {page === "courses" && <CourseList />}
        {page === "add" && <AddCourse />}
      </main>
    </div>
  );
}

export default App;
