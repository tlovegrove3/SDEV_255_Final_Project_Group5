import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, getRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated()) {
    window.location.hash = "#/login";
    return null;
  }

  if (requiredRole && getRole() !== requiredRole) {
    return <div>Access denied. Required role: {requiredRole}</div>;
  }

  return children;
};

export default ProtectedRoute;
