// Analytics API service for handling all analytics-related API calls
import { api, setApiBaseUrl } from '../utils/apiClient';

// Use proxy in development, direct URL in production
// Analytics API goes to a different backend than nexusai APIs
const API_BASE_URL = import.meta.env.DEV 
    ? '' // Empty string in dev mode to use Vite proxy
    : 'https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net';

// Configure the API client with the base URL
if (!import.meta.env.DEV) {
    setApiBaseUrl(API_BASE_URL);
}

/**
 * Fetch all conversation messages
 * @returns {Promise<Array>} - Array of conversation messages
 */
export const fetchConversationMessages = async () => {
    try {
        // Use /api prefix for analytics backend routes
        const response = await api.get('/api/UserChatHistory/All');
        return response.data;
    } catch (error) {
        console.error('Error fetching conversation messages:', error);
        throw error;
    }
};

/**
 * Transform API response to individual messages with MessageType
 * @param {Array} apiData - Array of conversation records from API
 * @returns {Array} - Array of individual message objects
 */
export const transformApiDataToMessages = (apiData) => {
    const messages = [];
    
    apiData.forEach(record => {
        // Create user message
        if (record.UserMessage) {
            messages.push({
                Id: `${record.Id}_user`,
                UserChatSessionId: record.UserChatSessionId,
                MessageType: 'User',
                Message: record.UserMessage,
                Timestamp: record.CreatedOn,
                Reaction: 'None'
            });
        }
        
        // Create AI message
        if (record.AIMessage) {
            messages.push({
                Id: `${record.Id}_ai`,
                UserChatSessionId: record.UserChatSessionId,
                MessageType: 'Assistant',
                Message: record.AIMessage,
                Timestamp: record.CreatedOn,
                Reaction: record.Reaction || 'None'
            });
        }
    });
    
    return messages;
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
        groupedConversations[sessionId].sort((a, b) => {
            const aId = parseInt(a.Id.split('_')[0]);
            const bId = parseInt(b.Id.split('_')[0]);
            if (aId === bId) {
                // If same record ID, user message comes before AI message
                return a.MessageType === 'User' ? -1 : 1;
            }
            return aId - bId;
        });
    });

    return Object.values(groupedConversations);
};

/**
 * Fetch and process conversations
 * @returns {Promise<Array>} - Array of processed conversations
 */
export const fetchConversations = async () => {
    try {
        const apiData = await fetchConversationMessages();
        const transformedMessages = transformApiDataToMessages(apiData);
        const groupedConversations = groupMessagesBySession(transformedMessages);
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
