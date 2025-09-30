import { getApiClient } from '../utils/apiClient';
import '../config/apiConfig'; // Initialize API configuration

// Base URL for the API
const BASE_URL = 'https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net';

// Create a separate axios instance for starter questions API since it uses a different endpoint
const starterQuestionsApi = getApiClient().create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'accept': 'text/plain'
    }
});

// Copy interceptors from the main API client to ensure authentication headers are added
const mainClient = getApiClient();
starterQuestionsApi.interceptors.request = mainClient.interceptors.request;
starterQuestionsApi.interceptors.response = mainClient.interceptors.response;

// StarterQuestions API endpoints
const STARTER_QUESTIONS_ENDPOINTS = {
  GET: '/StarterQuestions/Get',
  SAVE: '/StarterQuestions/Save'
};

/**
 * Get all starter questions
 * @returns {Promise} Promise that resolves to the starter questions data
 */
export const getStarterQuestions = async () => {
  try {
    const response = await starterQuestionsApi.get(STARTER_QUESTIONS_ENDPOINTS.GET);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching starter questions:', error);
    // Return default structure if API fails
    return {
      q1: '',
      a1: '',
      q2: '',
      a2: '',
      q3: '',
      a3: ''
    };
  }
};

/**
 * Save starter questions
 * @param {Object} questionsData - Object with q1, a1, q2, a2, q3, a3 properties
 * @returns {Promise} Promise that resolves to the saved data
 */
export const saveStarterQuestions = async (questionsData) => {
  try {
    const response = await starterQuestionsApi.put(STARTER_QUESTIONS_ENDPOINTS.SAVE, questionsData);
    
    return response.data;
  } catch (error) {
    console.error('Error saving starter questions:', error);
    throw error;
  }
};