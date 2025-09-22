import axios from 'axios';
import { getAccessTokenCookie, isTokenExpired, clearAuthCookies } from './cookieUtils';

/**
 * Enhanced API client with automatic authentication token handling
 */

// Create axios instance with default configuration
const apiClient = axios.create({
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add authentication token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessTokenCookie();
    
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle authentication errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response time for debugging
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    console.log(`API call to ${response.config.url} took ${duration}ms`);
    
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        console.warn('Unauthorized request detected, clearing auth cookies');
        clearAuthCookies();
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      
      // Handle 403 Forbidden errors
      if (error.response.status === 403) {
        console.warn('Forbidden request - user does not have required permissions');
      }
      
      // Handle 429 Too Many Requests
      if (error.response.status === 429) {
        console.warn('Rate limit exceeded');
      }
    } else if (error.request) {
      console.error('Network error or no response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * API utility functions
 */
export const api = {
  /**
   * GET request
   * @param {string} url - API endpoint
   * @param {object} config - Axios config options
   * @returns {Promise} API response
   */
  get: (url, config = {}) => {
    return apiClient.get(url, config);
  },

  /**
   * POST request
   * @param {string} url - API endpoint
   * @param {object} data - Request payload
   * @param {object} config - Axios config options
   * @returns {Promise} API response
   */
  post: (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
  },

  /**
   * PUT request
   * @param {string} url - API endpoint
   * @param {object} data - Request payload
   * @param {object} config - Axios config options
   * @returns {Promise} API response
   */
  put: (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
  },

  /**
   * PATCH request
   * @param {string} url - API endpoint
   * @param {object} data - Request payload
   * @param {object} config - Axios config options
   * @returns {Promise} API response
   */
  patch: (url, data = {}, config = {}) => {
    return apiClient.patch(url, data, config);
  },

  /**
   * DELETE request
   * @param {string} url - API endpoint
   * @param {object} config - Axios config options
   * @returns {Promise} API response
   */
  delete: (url, config = {}) => {
    return apiClient.delete(url, config);
  },

  /**
   * Upload file with progress tracking
   * @param {string} url - API endpoint
   * @param {FormData} formData - File data
   * @param {function} onProgress - Progress callback
   * @returns {Promise} API response
   */
  upload: (url, formData, onProgress = null) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      };
    }

    return apiClient.post(url, formData, config);
  },

  /**
   * Download file
   * @param {string} url - API endpoint
   * @param {string} filename - Download filename
   * @returns {Promise} API response
   */
  download: async (url, filename = 'download') => {
    const config = {
      responseType: 'blob',
    };

    try {
      const response = await apiClient.get(url, config);
      
      // Create blob link to download
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
      
      return response;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },
};

/**
 * Set base URL for API requests
 * @param {string} baseURL - Base URL for all requests
 */
export const setApiBaseUrl = (baseURL) => {
  apiClient.defaults.baseURL = baseURL;
};

/**
 * Set default timeout for API requests
 * @param {number} timeout - Timeout in milliseconds
 */
export const setApiTimeout = (timeout) => {
  apiClient.defaults.timeout = timeout;
};

/**
 * Add custom headers to all requests
 * @param {object} headers - Headers object
 */
export const setDefaultHeaders = (headers) => {
  Object.assign(apiClient.defaults.headers, headers);
};

/**
 * Get current axios instance (for advanced usage)
 * @returns {object} Axios instance
 */
export const getApiClient = () => {
  return apiClient;
};

export default api;