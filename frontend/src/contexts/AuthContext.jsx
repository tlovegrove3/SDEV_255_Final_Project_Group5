import { createContext, useContext, useState, useEffect } from "react";
import { apiConfig } from "../config/api";

const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = async (userId, password) => {
    const response = await apiConfig.fetchPublic("/auth/login", {
      method: "POST",
      body: JSON.stringify({ userId, password }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    // Store auth data
    setUser(data.data.user);
    setToken(data.data.token);
    localStorage.setItem("user", JSON.stringify(data.data.user));
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("role", data.data.role);

    // Redirect to courses page for both roles
    window.location.hash = "#/courses";
  };

  const register = async (registerData) => {
    const response = await apiConfig.fetchPublic("/auth/register", {
      method: "POST",
      body: JSON.stringify(registerData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    // Auto-login after registration
    setUser(data.data.user);
    setToken(data.data.token);
    localStorage.setItem("user", JSON.stringify(data.data.user));
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("role", data.data.role);

    // Redirect to courses page for both roles
    window.location.hash = "#/courses";
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.hash = "#/login";
  };

  const isAuthenticated = () => !!token && !!user;
  const getRole = () => localStorage.getItem("role");

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    getRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { useAuth };
