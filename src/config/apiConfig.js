// Centralized API configuration
import { setApiBaseUrl } from '../utils/apiClient';

// Define API base URLs for different services
export const API_ENDPOINTS = {
    // Backend API (Python backend)
    BACKEND: import.meta.env.DEV
        ? '' // Use Vite proxy in development
        : (import.meta.env.VITE_API_BASE_URL || 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net'),

    // Analytics API (might be different endpoint)
    ANALYTICS: import.meta.env.DEV
        ? '' // Use Vite proxy in development
        : (import.meta.env.VITE_ANALYTICS_API_URL || 'https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net')
};

// Initialize API configuration
export const initializeApiConfig = () => {
    // Set the backend API as default base URL
    // Most APIs use the backend endpoint
    setApiBaseUrl(API_ENDPOINTS.BACKEND);
    console.log('API Configuration initialized:', {
        isDev: import.meta.env.DEV,
        backend: API_ENDPOINTS.BACKEND,
        analytics: API_ENDPOINTS.ANALYTICS
    });
};

// Call initialization immediately
initializeApiConfig();