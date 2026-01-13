import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Mock auth service for demo mode
const mockAuthService = {
  login: async (email, password) => ({
    success: true,
    message: 'Demo login successful',
    token: 'demo-token-' + Date.now(),
    user: { email: email }
  }),
  signup: async (email, password) => ({
    success: true,
    message: 'Demo signup successful'
  }),
  verifyToken: async () => {
    const token = localStorage.getItem('token');
    if (token && token.startsWith('demo-token')) {
      return {
        success: true,
        user: { email: 'demo@example.com' }
      };
    }
    return { success: false, message: 'Invalid token' };
  }
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  SIGNUP_START: 'SIGNUP_START',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_FAILURE: 'SIGNUP_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER'
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.SIGNUP_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.SIGNUP_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        error: null
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app load
  useEffect(() => {
    // Immediately set loading to false for demo mode
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const response = await mockAuthService.login(email, password);
      
      if (response.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.token);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: response.user,
            token: response.token
          }
        });
        
        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: response.message || 'Login failed'
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = 'Demo login error';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };

  // Signup function
  const signup = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SIGNUP_START });
      
      const response = await mockAuthService.signup(email, password);
      
      if (response.success) {
        dispatch({ type: AUTH_ACTIONS.SIGNUP_SUCCESS });
        return { success: true, message: response.message };
      } else {
        dispatch({
          type: AUTH_ACTIONS.SIGNUP_FAILURE,
          payload: response.message || 'Signup failed'
        });
        return { success: false, message: response.message, errors: response.errors };
      }
    } catch (error) {
      const errorMessage = 'Demo signup error';
      dispatch({
        type: AUTH_ACTIONS.SIGNUP_FAILURE,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      // Always set loading to false in demo mode
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      console.warn('Auth check failed, continuing without authentication:', error);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    ...state,
    login,
    signup,
    logout,
    checkAuthStatus,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;