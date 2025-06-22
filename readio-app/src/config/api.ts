// API Configuration
// IMPORTANT: This application requires a backend server to function properly.
// The frontend will not proceed without successful backend communication.
export const API_CONFIG = {
  // Base URL for the backend API
  // Can be overridden by environment variable REACT_APP_API_BASE_URL
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  
  // API Endpoints
  ENDPOINTS: {
    USER_PREFERENCES: '/api/user-preferences',
    USER_LOGIN: '/api/auth/login',
    USER_SIGNUP: '/api/auth/signup',
    BOOK_RECOMMENDATIONS: '/api/recommendations',
    STORY_CREATION: '/api/story-creation',
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to make API requests with error handling
export const apiRequest = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const url = buildApiUrl(endpoint);
  
  const requestOptions: RequestInit = {
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
    ...options,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...requestOptions,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}; 