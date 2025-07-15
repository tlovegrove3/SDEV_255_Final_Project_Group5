import { useState } from 'react';
import Home from '/components/Home';
//import CourseList from '/components/CourseList';
//import AddCourse from '/components/AddCourse';
import './App.css';

function App() {
  const [page, setPage] = useState('home');

  return (
    <div>
      <nav className="navbar">
        <h2>University Course Manager</h2>
        <div className="nav-links">
          <button onClick={() => setPage('home')}>Home</button>
          <button onClick={() => setPage('courses')}>Courses</button>
          <button onClick={() => setPage('add')}>Add Course</button>
        </div>
      </nav>

      <main>
        {page === 'home' && <Home />}
        {page === 'courses' && <CourseList />}
        {page === 'add' && <AddCourse />}
      </main>
    </div>
  );
}

export default App;
