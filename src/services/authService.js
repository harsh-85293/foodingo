// Base API URL - adjust based on your server configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api'  // Replace with your actual backend URL
  : 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // If response is not ok, throw an error with the response data
    const error = new Error(data.message || 'API request failed');
    error.response = { data };
    throw error;
  }
  
  return data;
};

// Authentication service object
export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      // For authentication endpoints, return the data regardless of status
      // The calling code will check the success field
      return data;
    } catch (error) {
      console.error('Login service error:', error);
      // Return a structured error response instead of throwing
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  },

  // Register new user
  signup: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      // For authentication endpoints, return the data regardless of status
      return data;
    } catch (error) {
      console.error('Signup service error:', error);
      // Return a structured error response instead of throwing
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  },

  // Verify token and get user data
  verifyToken: async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return {
          success: false,
          message: 'No token found'
        };
      }

      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Token verification service error:', error);
      return {
        success: false,
        message: 'Token verification failed'
      };
    }
  },

  // Logout user (client-side cleanup)
  logout: () => {
    localStorage.removeItem('token');
  }
};

// Request interceptor utility for adding auth headers to any request
export const createAuthenticatedRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: getAuthHeaders(),
    ...options
  };

  try {
    const response = await fetch(url, defaultOptions);
    return await handleResponse(response);
  } catch (error) {
    // If token is expired or invalid, redirect to login
    if (error.response?.data?.message?.includes('token') || 
        error.response?.data?.message?.includes('expired')) {
      localStorage.removeItem('token');
      // You can dispatch a logout action here if needed
      window.location.href = '/login';
    }
    throw error;
  }
};

// Utility function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Utility function to get current user token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Utility function to decode JWT token (basic decode, not verification)
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Utility function to check if token is expired
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export default authService;