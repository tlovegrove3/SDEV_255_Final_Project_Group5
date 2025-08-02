import AddCourse from "./components/AddCourse.jsx";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import CourseDetail from "./components/CourseDetail.jsx";
import CourseList from "./components/CourseList.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import MyCourses from "./components/MyCourses";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Register from "./components/Register.jsx";
import ShoppingCart from "./components/ShoppingCart.jsx";
import { useHash, parseHash } from "./hooks/useHash";

function App() {
  const { page, id } = parseHash(useHash().hash);

  const renderPage = () => {
    switch (page) {
      case '':
      case 'home':
        return <Home />;

      case 'login':
        return <Login />;

      case 'register':
        return <Register />;

      case 'student-dashboard':
        return (
          <ProtectedRoute requiredRole="student">
            <CourseList />
          </ProtectedRoute>
        );

      case 'teacher-dashboard':
        return (
          <ProtectedRoute requiredRole="teacher">
            <CourseList />
          </ProtectedRoute>
        );

      case 'my-courses':
        return (
          <ProtectedRoute requiredRole="student">
            <MyCourses />
          </ProtectedRoute>
        );

      case 'cart':
        return (
          <ProtectedRoute requiredRole="student">
            <ShoppingCart />
          </ProtectedRoute>
        );

      case 'courses':
        if (id) {
          return <CourseDetail courseId={id} />;
        }
        return <CourseList />;

      case 'add-course':
        return (
          <ProtectedRoute requiredRole="teacher">
            <AddCourse />
          </ProtectedRoute>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="app-layout">
            <Navigation />
            <main className="main-content">
              {renderPage()}
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
