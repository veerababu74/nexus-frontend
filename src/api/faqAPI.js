// FAQ API service for handling all FAQ-related API calls
import { api, setApiBaseUrl } from '../utils/apiClient';

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV 
    ? '' 
    : (import.meta.env.VITE_API_BASE_URL || 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net');

// Configure the API client with the base URL if not in development
if (!import.meta.env.DEV) {
    setApiBaseUrl(API_BASE_URL);
}

/**
 * Insert a new FAQ record
 * @param {Object} faqData - The FAQ data containing title, answer, and tags
 * @returns {Promise<Object>} - The API response
 */
export const insertFAQ = async (faqData) => {
    try {
        console.log('Inserting FAQ with data:', faqData);

        // Map the field names to match API expectations
        const apiData = {
            question: faqData.question,
            answer: faqData.answer,
            tags: faqData.tags
        };

        const response = await api.post('/nexusai/faq/insert', apiData);

        console.log('Insert FAQ response status:', response.status);
        console.log('Insert FAQ response data:', response.data);

        return response.data;
    } catch (error) {
        console.error('Error inserting FAQ:', error);
        throw new Error('Failed to insert FAQ. Please try again.');
    }
};

/**
 * Fetch all FAQ records from the backend
 * @returns {Promise<Array>} - Array of FAQ records
 */
export const getAllFAQs = async () => {
    try {
        console.log('Fetching all FAQs');

        const response = await api.get('/nexusai/faqs/all');

        console.log('Get all FAQs response status:', response.status);
        console.log('Get all FAQs response data:', response.data);

        const data = response.data;

        // Check if the API returned success
        if (!data.success) {
            throw new Error(data.message || 'API returned unsuccessful response');
        }

        // Map the API response to match the expected format
        const faqs = (data.response || []).map(faq => ({
            id: faq.FaqUniqueId,
            question: faq.Title,
            answer: faq.Answer,
            tags: faq.Tags
        }));

        console.log('Mapped FAQs:', faqs);
        return { data: faqs };
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        throw new Error('Failed to fetch FAQs. Please try again.');
    }
};

/**
 * Delete a specific FAQ record by ID
 * @param {string} id - The FAQ unique ID to delete
 * @returns {Promise<Object>} - The API response
 */
export const deleteFAQ = async (id) => {
    try {
        console.log('Deleting FAQ with unique ID:', id);

        const response = await api.delete('/nexusai/faq/delete', {
            data: {
                faq_unique_id: id
            }
        });

        console.log('Delete FAQ response status:', response.status);
        console.log('Delete FAQ response data:', response.data);

        return response.data;
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        throw new Error('Failed to delete FAQ. Please try again.');
    }
};
