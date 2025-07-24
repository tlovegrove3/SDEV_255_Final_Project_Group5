// API Configuration
// Automatically uses the correct base URL based on environment
// Development: http://localhost:3000/api
// Production: https://sdev-255-final-project-group5.onrender.com/api

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// API helper functions
export const apiConfig = {
  baseURL: BASE_URL,
  
  // Get full API endpoint URL
  getEndpoint: (path) => `${BASE_URL}${path}`,
  
  // Default headers for API requests
  getHeaders: (includeAuth = false) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return headers;
  },
  
  // Helper for making authenticated requests
  fetchWithAuth: async (endpoint, options = {}) => {
    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...apiConfig.getHeaders(true),
        ...options.headers,
      },
    });
  },
  
  // Helper for making public requests
  fetchPublic: async (endpoint, options = {}) => {
    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...apiConfig.getHeaders(false),
        ...options.headers,
      },
    });
  }
};

// Export base URL for backward compatibility
export const API_BASE_URL = BASE_URL;

// Environment check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Debug logging in development
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    baseURL: BASE_URL,
    environment: import.meta.env.MODE,
    isDevelopment,
    isProduction
  });
}