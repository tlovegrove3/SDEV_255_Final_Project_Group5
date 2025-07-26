// hooks/useHash.js
import { useState, useEffect } from "react";

/**
 * Custom hook for managing hash-based routing
 */
export function useHash() {
  // Function to get current hash from URL
  const getHash = () => {
    // window.location.hash gives us something like "#/courses"
    // We want just "/courses", so we remove the "#"
    const hash = window.location.hash;
    return hash.startsWith("#") ? hash.slice(1) : "/";
  };

  // State to track current hash
  const [hash, setHash] = useState(getHash);

  useEffect(() => {
    // This function runs whenever the hash changes
    const handleHashChange = () => {
      setHash(getHash());
    };

    // Listen for hash changes (when user clicks back/forward or types in URL)
    window.addEventListener("hashchange", handleHashChange);

    // Also check hash on first load (in case someone bookmarked a specific page)
    handleHashChange();

    // Cleanup: remove listener when component unmounts
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Function to programmatically navigate to a new hash
  const navigate = (newHash) => {
    // Make sure hash starts with "/"
    const fullHash = newHash.startsWith("/") ? newHash : `/${newHash}`;
    window.location.hash = fullHash;
  };

  return {
    hash, // Current hash (like "/courses" or "/courses/123")
    navigate, // Function to change hash programmatically
  };
}

/**
 * Helper function to parse hash into useful parts
 *
 * Examples:
 * parseHash("/courses") → { page: "courses", id: null }
 * parseHash("/courses/123") → { page: "courses", id: "123" }
 * parseHash("/add-course") → { page: "add-course", id: null }
 */
export function parseHash(hash) {
  // Remove leading slash and split by "/"
  const parts = hash.replace(/^\//, "").split("/");

  return {
    page: parts[0] || "home", // First part is the page name
    id: parts[1] || null, // Second part might be an ID
  };
}

/**
 * Helper function to build hash URLs
 *
 * Examples:
 * buildHash("courses") → "/courses"
 * buildHash("courses", "123") → "/courses/123"
 */
export function buildHash(page, id = null) {
  return id ? `/${page}/${id}` : `/${page}`;
}
