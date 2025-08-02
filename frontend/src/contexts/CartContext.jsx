import { createContext, useContext, useState, useEffect } from "react";
import { apiConfig } from "../config/api";
import { useAuth } from "../hooks/useAuth";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, getRole } = useAuth();

  const fetchCartCount = async () => {
    if (!isAuthenticated() || getRole() !== "student") {
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      const response = await apiConfig.fetchWithAuth("/cart");
      const result = await response.json();
      
      if (response.ok && result.success) {
        setCartCount(result.data.courses.length);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = () => {
    fetchCartCount();
  };

  useEffect(() => {
    fetchCartCount();
  }, [isAuthenticated(), getRole()]);

  return (
    <CartContext.Provider value={{
      cartCount,
      loading,
      refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}