import axios from 'axios';

// Base URL for the API
const BASE_URL = 'https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net';

// API endpoints
const TONE_SAFETY_ENDPOINTS = {
  // Banned Phrases
  BANNED_PHRASES_INSERT: `${BASE_URL}/BannedPhrases/Insert`,
  BANNED_PHRASES_ALL: `${BASE_URL}/BannedPhrases/All`,
  BANNED_PHRASES_DELETE: `${BASE_URL}/BannedPhrases/Delete`,
  
  // Safety Copy
  SAFETY_COPY_UPDATE: `${BASE_URL}/SafetyCopy/Update`,
  SAFETY_COPY_GET: `${BASE_URL}/SafetyCopy/Get`,
  
  // Soft Red Flag
  SOFT_RED_FLAG_INSERT: `${BASE_URL}/SoftRedFlag/Insert`,
  SOFT_RED_FLAG_ALL: `${BASE_URL}/SoftRedFlag/All`,
  SOFT_RED_FLAG_DELETE: `${BASE_URL}/SoftRedFlag/Delete`,
};

// ======================== BANNED PHRASES API ========================

/**
 * Get all banned phrases
 * @returns {Promise} Promise that resolves to array of banned phrases
 */
export const getAllBannedPhrases = async () => {
  try {
    const response = await axios.get(TONE_SAFETY_ENDPOINTS.BANNED_PHRASES_ALL, {
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
      }
    });
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
    const response = await axios.post(TONE_SAFETY_ENDPOINTS.BANNED_PHRASES_INSERT, {
      Phrase: phrase
    }, {
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
      }
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
    const response = await axios.delete(TONE_SAFETY_ENDPOINTS.BANNED_PHRASES_DELETE, {
      params: { id },
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
      }
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
    const response = await axios.get(TONE_SAFETY_ENDPOINTS.SAFETY_COPY_GET, {
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
      }
    });
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
    const response = await axios.put(TONE_SAFETY_ENDPOINTS.SAFETY_COPY_UPDATE, {
      HeaderDisclaimer: safetyCopyData.HeaderDisclaimer,
      RefusalBannedPhrase: safetyCopyData.RefusalBannedPhrase,
      EscalationSoftRedFlag: safetyCopyData.EscalationSoftRedFlag
    }, {
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
      }
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
    const response = await axios.get(TONE_SAFETY_ENDPOINTS.SOFT_RED_FLAG_ALL, {
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
      }
    });
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
    const response = await axios.post(TONE_SAFETY_ENDPOINTS.SOFT_RED_FLAG_INSERT, {
      Phrase: phrase
    }, {
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
      }
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
    const response = await axios.delete(TONE_SAFETY_ENDPOINTS.SOFT_RED_FLAG_DELETE, {
      params: { id },
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting soft red flag:', error);
    throw error;
  }
};