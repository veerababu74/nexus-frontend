import { getApiClient } from '../utils/apiClient';
import '../config/apiConfig'; // Initialize API configuration

// Base URL for the API
const BASE_URL = 'https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net';

// Create a separate axios instance for tone safety API since it uses a different endpoint
const toneSafetyApi = getApiClient().create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'accept': 'text/plain'
    }
});

// Copy interceptors from the main API client to ensure authentication headers are added
const mainClient = getApiClient();
toneSafetyApi.interceptors.request = mainClient.interceptors.request;
toneSafetyApi.interceptors.response = mainClient.interceptors.response;

// API endpoints
const TONE_SAFETY_ENDPOINTS = {
  // Banned Phrases
  BANNED_PHRASES_INSERT: '/BannedPhrases/Insert',
  BANNED_PHRASES_ALL: '/BannedPhrases/All',
  BANNED_PHRASES_DELETE: '/BannedPhrases/Delete',
  
  // Safety Copy
  SAFETY_COPY_UPDATE: '/SafetyCopy/Update',
  SAFETY_COPY_GET: '/SafetyCopy/Get',
  
  // Soft Red Flag
  SOFT_RED_FLAG_INSERT: '/SoftRedFlag/Insert',
  SOFT_RED_FLAG_ALL: '/SoftRedFlag/All',
  SOFT_RED_FLAG_DELETE: '/SoftRedFlag/Delete',
};

// ======================== BANNED PHRASES API ========================

/**
 * Get all banned phrases
 * @returns {Promise} Promise that resolves to array of banned phrases
 */
export const getAllBannedPhrases = async () => {
  try {
    const response = await toneSafetyApi.get(TONE_SAFETY_ENDPOINTS.BANNED_PHRASES_ALL);
    return response.data;
  } catch (error) {
    console.error('Error fetching banned phrases:', error);
    // Return empty array as fallback
    return [];
  }
};

/**
 * Insert a new banned phrase
 * @param {string} phrase - The phrase to ban
 * @returns {Promise} Promise that resolves to the response
 */
export const insertBannedPhrase = async (phrase) => {
  try {
    const response = await toneSafetyApi.post(TONE_SAFETY_ENDPOINTS.BANNED_PHRASES_INSERT, {
      Phrase: phrase
    });
    return response.data;
  } catch (error) {
    console.error('Error inserting banned phrase:', error);
    throw error;
  }
};

/**
 * Delete a banned phrase
 * @param {string|number} id - The ID of the phrase to delete
 * @returns {Promise} Promise that resolves to the response
 */
export const deleteBannedPhrase = async (id) => {
  try {
    const response = await toneSafetyApi.delete(TONE_SAFETY_ENDPOINTS.BANNED_PHRASES_DELETE, {
      params: { id }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting banned phrase:', error);
    throw error;
  }
};

// ======================== SAFETY COPY API ========================

/**
 * Get safety copy configuration
 * @returns {Promise} Promise that resolves to safety copy data
 */
export const getSafetyCopy = async () => {
  try {
    const response = await toneSafetyApi.get(TONE_SAFETY_ENDPOINTS.SAFETY_COPY_GET);
    return response.data;
  } catch (error) {
    console.error('Error fetching safety copy:', error);
    // Return default structure if API fails
    return {
      HeaderDisclaimer: "I'm an educational assistant at this clinic. I don't provide",
      RefusalBannedPhrase: "I can't help with symptoms, diagnosis, or medications. For urgent",
      EscalationSoftRedFlag: "Your message suggests something that may need urgent attention"
    };
  }
};

/**
 * Update safety copy configuration
 * @param {Object} safetyCopyData - Object with HeaderDisclaimer, RefusalBannedPhrase, EscalationSoftRedFlag
 * @returns {Promise} Promise that resolves to the response
 */
export const updateSafetyCopy = async (safetyCopyData) => {
  try {
    const response = await toneSafetyApi.put(TONE_SAFETY_ENDPOINTS.SAFETY_COPY_UPDATE, {
      HeaderDisclaimer: safetyCopyData.HeaderDisclaimer,
      RefusalBannedPhrase: safetyCopyData.RefusalBannedPhrase,
      EscalationSoftRedFlag: safetyCopyData.EscalationSoftRedFlag
    });
    return response.data;
  } catch (error) {
    console.error('Error updating safety copy:', error);
    throw error;
  }
};

// ======================== SOFT RED FLAG API ========================

/**
 * Get all soft red flag keywords
 * @returns {Promise} Promise that resolves to array of soft red flag keywords
 */
export const getAllSoftRedFlags = async () => {
  try {
    const response = await toneSafetyApi.get(TONE_SAFETY_ENDPOINTS.SOFT_RED_FLAG_ALL);
    return response.data;
  } catch (error) {
    console.error('Error fetching soft red flags:', error);
    // Return empty array as fallback
    return [];
  }
};

/**
 * Insert a new soft red flag keyword
 * @param {string} phrase - The keyword to add as soft red flag
 * @returns {Promise} Promise that resolves to the response
 */
export const insertSoftRedFlag = async (phrase) => {
  try {
    const response = await toneSafetyApi.post(TONE_SAFETY_ENDPOINTS.SOFT_RED_FLAG_INSERT, {
      Phrase: phrase
    });
    return response.data;
  } catch (error) {
    console.error('Error inserting soft red flag:', error);
    throw error;
  }
};

/**
 * Delete a soft red flag keyword
 * @param {string|number} id - The ID of the keyword to delete
 * @returns {Promise} Promise that resolves to the response
 */
export const deleteSoftRedFlag = async (id) => {
  try {
    const response = await toneSafetyApi.delete(TONE_SAFETY_ENDPOINTS.SOFT_RED_FLAG_DELETE, {
      params: { id }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting soft red flag:', error);
    throw error;
  }
};