// Chat API service for handling all chat-related API calls

const API_BASE_URL = 'http://127.0.0.1:8000'; // Update this to your backend URL

/**
 * Fetch chat response from the backend
 * @param {Object} requestPayload - The request payload containing query, history, etc.
 * @returns {Promise<string>} - The AI response
 */
export const fetchChatResponse = async (requestPayload) => {
    try {
        const response = await fetch(`${API_BASE_URL}/nexusai/conversation/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.response || data.message || 'No response received';
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
