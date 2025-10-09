import { api } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';

/**
 * Settings API module
 * Handles all settings-related API calls
 */

/**
 * Get settings from the API
 * @returns {Promise<Object>} Settings data
 */
export const getSettings = async () => {
  try {
    // Use different endpoints for development and production
    const endpoint = import.meta.env.DEV ? '/api/Settings/Get' : '/Settings/Get';
    const config = import.meta.env.DEV ? {} : { baseURL: API_ENDPOINTS.ANALYTICS };
    
    const response = await api.get(endpoint, config);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw new Error('Failed to fetch settings data');
  }
};

/**
 * Update settings (save settings to the API)
 * @param {Object} settingsData - Settings data to update
 * @returns {Promise<Object>} Updated settings data
 */
export const updateSettings = async (settingsData) => {
  try {
    // Use different endpoints for development and production
    const endpoint = import.meta.env.DEV ? '/api/Settings/Save' : '/Settings/Save';
    const config = import.meta.env.DEV ? {} : { baseURL: API_ENDPOINTS.ANALYTICS };
    
    const response = await api.put(endpoint, settingsData, config);
    
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw new Error('Failed to update settings data');
  }
};

export default {
  getSettings,
  updateSettings
};