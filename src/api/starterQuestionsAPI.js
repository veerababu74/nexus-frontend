import axios from 'axios';

// StarterQuestions API endpoints
const STARTER_QUESTIONS_ENDPOINTS = {
  GET: 'https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net/StarterQuestions/Get',
  SAVE: 'https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net/StarterQuestions/Save'
};

/**
 * Get all starter questions
 * @returns {Promise} Promise that resolves to the starter questions data
 */
export const getStarterQuestions = async () => {
  try {
    const response = await axios.get(STARTER_QUESTIONS_ENDPOINTS.GET, {
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
      }
    });
    
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
    const response = await axios.put(STARTER_QUESTIONS_ENDPOINTS.SAVE, questionsData, {
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error saving starter questions:', error);
    throw error;
  }
};