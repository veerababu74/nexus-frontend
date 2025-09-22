// Chat API service for handling all chat-related API calls
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
 * Fetch chat response from the backend
 * @param {Object} requestPayload - The request payload containing query, history, etc.
 * @returns {Promise<string>} - The AI response
 */
export const fetchChatResponse = async (requestPayload) => {
    try {
        console.log('Sending request payload:', requestPayload);
        
        const response = await api.post('/nexusai/conversation/chat', requestPayload);

        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

        const data = response.data;
        return data.response || data.message || data.answer || data.reply || data.content || 'No response received';
    } catch (error) {
        console.error('Error fetching chat response:', error);
        throw new Error('Failed to get AI response. Please try again.');
    }
};

/**
 * Fetch chat history from the backend
 * @param {string} sessionId - Optional session ID to retrieve specific chat history
 * @returns {Promise<Array>} - Array of chat history items
 */
export const fetchChatHistory = async (sessionId = null) => {
    try {
        const endpoint = sessionId
            ? `/chat/history/${sessionId}`
            : '/chat/history';

        const response = await api.get(endpoint);
        return response.data.history || [];
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return [];
    }
};

/**
 * Save chat session to the backend
 * @param {Array} chatHistory - The chat history to save
 * @param {string} sessionId - Optional session ID
 * @returns {Promise<Object>} - Response containing session info
 */
export const saveChatSession = async (chatHistory, sessionId = null) => {
    try {
        const response = await api.post('/chat/save', {
            history: chatHistory,
            sessionId: sessionId,
        });

        return response.data;
    } catch (error) {
        console.error('Error saving chat session:', error);
        throw new Error('Failed to save chat session.');
    }
};

/**
 * Clear chat history
 * @param {string} sessionId - Optional session ID to clear specific session
 * @returns {Promise<boolean>} - Success status
 */
export const clearChatHistory = async (sessionId = null) => {
    try {
        const endpoint = sessionId
            ? `/chat/clear/${sessionId}`
            : '/chat/clear';

        const response = await api.delete(endpoint);
        return response.status === 200;
    } catch (error) {
        console.error('Error clearing chat history:', error);
        return false;
    }
};
