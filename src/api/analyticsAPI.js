// Analytics API service for handling all analytics-related API calls

const API_BASE_URL = 'https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net';

// Demo data for testing when API is not available
const demoData = [
    {
        "Id": "4",
        "UserChatSessionId": "1",
        "MessageType": "User",
        "Message": "Who are you",
        "Reaction": "None",
        "Timestamp": "2025-09-11T10:30:00Z"
    },
    {
        "Id": "5",
        "UserChatSessionId": "1",
        "MessageType": "Assistant",
        "Message": "I am doctor Deepak, how can I assist you",
        "Reaction": "None",
        "Timestamp": "2025-09-11T10:30:15Z"
    },
    {
        "Id": "6",
        "UserChatSessionId": "2",
        "MessageType": "User",
        "Message": "What are your hours?",
        "Reaction": "None",
        "Timestamp": "2025-09-11T14:15:00Z"
    },
    {
        "Id": "7",
        "UserChatSessionId": "2",
        "MessageType": "Assistant",
        "Message": "I'm available 24/7 to help you with your medical questions.",
        "Reaction": "None",
        "Timestamp": "2025-09-11T14:15:10Z"
    },
    {
        "Id": "8",
        "UserChatSessionId": "2",
        "MessageType": "User",
        "Message": "Thank you!",
        "Reaction": "None",
        "Timestamp": "2025-09-11T14:15:20Z"
    }
];

/**
 * Fetch all conversation messages
 * @returns {Promise<Array>} - Array of conversation messages
 */
export const fetchConversationMessages = async () => {
    try {
        // Note: Update this endpoint to the correct API endpoint when available
        // Currently using the provided URL, but it should be something like '/api/conversations'
        const response = await fetch(`${API_BASE_URL}/api/conversations`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching conversation messages, using demo data:', error);
        // Return demo data for testing purposes when API is not available
        return demoData;
    }
};

/**
 * Group conversation messages by session ID
 * @param {Array} messages - Array of message objects
 * @returns {Array} - Array of grouped conversations
 */
export const groupMessagesBySession = (messages) => {
    const groupedConversations = messages.reduce((acc, message) => {
        const sessionId = message.UserChatSessionId;
        if (!acc[sessionId]) {
            acc[sessionId] = [];
        }
        acc[sessionId].push(message);
        return acc;
    }, {});

    // Sort messages within each session by ID to maintain order
    Object.keys(groupedConversations).forEach(sessionId => {
        groupedConversations[sessionId].sort((a, b) => parseInt(a.Id) - parseInt(b.Id));
    });

    return Object.values(groupedConversations);
};

/**
 * Fetch and process conversations
 * @returns {Promise<Array>} - Array of processed conversations
 */
export const fetchConversations = async () => {
    try {
        const messages = await fetchConversationMessages();
        const groupedConversations = groupMessagesBySession(messages);
        return groupedConversations;
    } catch (error) {
        console.error('Error processing conversations:', error);
        throw error;
    }
};

/**
 * Get analytics summary data
 * @returns {Promise<Object>} - Analytics summary object
 */
export const fetchAnalyticsSummary = async () => {
    try {
        const conversations = await fetchConversations();
        
        // Calculate basic analytics
        const totalConversations = conversations.length;
        const totalMessages = conversations.reduce((acc, conv) => acc + conv.length, 0);
        const userMessages = conversations.reduce((acc, conv) => 
            acc + conv.filter(msg => msg.MessageType === 'User').length, 0);
        
        return {
            totalConversations,
            totalMessages,
            userMessages,
            assistantMessages: totalMessages - userMessages,
            averageMessagesPerConversation: totalConversations > 0 ? Math.round(totalMessages / totalConversations) : 0
        };
    } catch (error) {
        console.error('Error fetching analytics summary:', error);
        throw error;
    }
};
