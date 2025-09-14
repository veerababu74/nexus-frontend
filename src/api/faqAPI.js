// FAQ API service for handling all FAQ-related API calls
// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV 
    ? '' 
    : (import.meta.env.VITE_API_BASE_URL || 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net');

/**
 * Insert a new FAQ record
 * @param {Object} faqData - The FAQ data containing title, answer, and tags
 * @returns {Promise<Object>} - The API response
 */
export const insertFAQ = async (faqData) => {
    try {
        console.log('Inserting FAQ with data:', faqData);
        console.log('API URL:', `${API_BASE_URL}/nexusai/faq/insert`);

        // Map the field names to match API expectations
        const apiData = {
            title: faqData.question,
            answer: faqData.answer,
            tags: faqData.tags
        };

        const response = await fetch(`${API_BASE_URL}/nexusai/faq/insert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData),
        });

        console.log('Insert FAQ response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response body:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Insert FAQ response data:', data);

        return data;
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
        console.log('API URL:', `${API_BASE_URL}/nexusai/faqs/all`);

        const response = await fetch(`${API_BASE_URL}/nexusai/faqs/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Get all FAQs response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response body:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Get all FAQs response data:', data);

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
        console.log('API URL:', `${API_BASE_URL}/nexusai/faq/delete`);

        const response = await fetch(`${API_BASE_URL}/nexusai/faq/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                faq_unique_id: id
            }),
        });

        console.log('Delete FAQ response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response body:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Delete FAQ response data:', data);

        return data;
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        throw new Error('Failed to delete FAQ. Please try again.');
    }
};
