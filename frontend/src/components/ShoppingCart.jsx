import { useState, useEffect } from "react";
import { useHash } from "../hooks/useHash";
import { apiConfig } from "../config/api";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../contexts/CartContext";

function ShoppingCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const { navigate } = useHash();
  const { isAuthenticated, getRole } = useAuth();
  const { refreshCart } = useCart();
  const role = getRole();

  useEffect(() => {
    if (isAuthenticated() && role === "student") {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await apiConfig.fetchWithAuth("/cart");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch cart");
      }

      setCart(result.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (courseId) => {
    try {
      const response = await apiConfig.fetchWithAuth(`/cart/${courseId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to remove course");
      }

      setCart(result.data);
      setMessage("Course removed from cart");
      refreshCart(); // Update cart count
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };


  const checkout = async () => {
    if (!window.confirm(`Enroll in ${cart.courses.length} course(s)?`)) return;

    try {
      setCheckoutLoading(true);
      const response = await apiConfig.fetchWithAuth("/cart/checkout", {
        method: "POST",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to complete checkout");
      }

      setCart({ ...cart, courses: [] });
      setMessage(result.message);
      refreshCart(); // Update cart count to 0
      
      if (result.data.errors && result.data.errors.length > 0) {
        setError("Some courses had issues: " + result.data.errors.join(", "));
      }

      setTimeout(() => {
        setMessage(null);
        setError(null);
        navigate("/my-courses");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!isAuthenticated() || role !== "student") {
    return (
      <div className="error">
        <h2>🔒 Access Denied</h2>
        <p>Shopping cart is only available for students.</p>
        <button onClick={() => navigate("/login")} className="login-btn">
          Login as Student
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <h2>🛒 Loading your cart...</h2>
        <p>Please wait while we fetch your cart contents.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>❌ Error Loading Cart</h2>
        <p>{error}</p>
        <button onClick={fetchCart} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  const totalCredits = cart?.courses?.reduce((sum, course) => sum + course.credits, 0) || 0;

  return (
    <div className="shopping-cart">
      <div className="page-header">
        <button onClick={() => navigate("/courses")} className="back-btn">
          ← Back to Courses
        </button>
        <h2>🛒 Shopping Cart</h2>
        <p>Review your selected courses before enrolling</p>
      </div>

      {message && (
        <div className="status-message">
          ✅ {message}
        </div>
      )}

      {error && (
        <div className="error">
          ❌ {error}
        </div>
      )}

      {!cart?.courses || cart.courses.length === 0 ? (
        <div className="empty-state">
          <h3>🛒 Your cart is empty</h3>
          <p>Browse courses and add them to your cart before enrolling.</p>
          <button onClick={() => navigate("/courses")} className="cta-btn">
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="course-info-card cart-summary">
            <h3>Cart Summary</h3>
            <p><strong>Courses:</strong> {cart.courses.length}</p>
            <p><strong>Total Credits:</strong> {totalCredits}</p>
          </div>

          <div className="course-info-card">
            <table className="courses-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Credits</th>
                  <th>Subject Area</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.courses.map((course) => (
                  <tr key={course._id}>
                    <td>
                      <button
                        onClick={() => navigate(`/courses/${course._id}`)}
                        className="course-link"
                      >
                        {course.code}
                      </button>
                    </td>
                    <td>{course.cname}</td>
                    <td>{course.credits}</td>
                    <td>{course.subject_area}</td>
                    <td>
                      <button
                        onClick={() => removeFromCart(course._id)}
                        className="delete-btn"
                        title="Remove from cart"
                      >
                        🗑️ Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="course-actions">
            <button
              onClick={checkout}
              disabled={checkoutLoading}
              className="edit-btn"
            >
              {checkoutLoading ? "⏳ Enrolling..." : "✅ Enroll in All Courses"}
            </button>
            
            <div className="status-message">
              ℹ️ Clicking "Enroll in All Courses" will add all courses to your enrolled courses list.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingCart;