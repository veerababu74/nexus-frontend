import axios from 'axios';
import { getAccessTokenCookie, isTokenExpired } from '../utils/cookieUtils';

// Dashboard API base URL
const DASHBOARD_API_BASE_URL = 'https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net';

// Create a specific axios instance for dashboard API
const dashboardApiClient = axios.create({
  baseURL: DASHBOARD_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
dashboardApiClient.interceptors.request.use(
  (config) => {
    const token = getAccessTokenCookie();
    
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Dashboard API request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Fetch dashboard results including leads count, conversation count, self serve percentage, and incidents
 * @returns {Promise<Object>} Dashboard data
 */
export const getDashboardResults = async () => {
  try {
    const response = await dashboardApiClient.get('/General/GetDashboardResults');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard results:', error);
    throw error;
  }
};