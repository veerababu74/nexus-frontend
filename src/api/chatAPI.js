// Chat API service for handling all chat-related API calls
//https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net
//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net'; // Update this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'; // Update this to your backend URL

/**
 * Fetch chat response from the backend
 * @param {Object} requestPayload - The request payload containing query, history, etc.
 * @returns {Promise<string>} - The AI response
 */
export const fetchChatResponse = async (requestPayload) => {
    try {
        console.log('Sending request payload:', requestPayload);
        console.log('API URL:', `${API_BASE_URL}/nexusai/conversation/chat`);

        const response = await fetch(`${API_BASE_URL}/nexusai/conversation/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response body:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

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
        const url = sessionId
            ? `${API_BASE_URL}/chat/history/${sessionId}`
            : `${API_BASE_URL}/chat/history`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.history || [];
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
        const response = await fetch(`${API_BASE_URL}/chat/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                history: chatHistory,
                sessionId: sessionId,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
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
        const url = sessionId
            ? `${API_BASE_URL}/chat/clear/${sessionId}`
            : `${API_BASE_URL}/chat/clear`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.ok;
    } catch (error) {
        console.error('Error clearing chat history:', error);
        return false;
    }
};
