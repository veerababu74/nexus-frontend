// Analytics API service for handling all analytics-related API calls
import { getApiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';

// Create a separate axios instance for analytics API since it uses a different endpoint
const analyticsApi = getApiClient().create({
    baseURL: API_ENDPOINTS.ANALYTICS,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Create a separate axios instance for staff API using the same base URL as analytics
const staffApi = getApiClient().create({
    baseURL: API_ENDPOINTS.ANALYTICS, // Use the same endpoint as analytics
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'accept': 'text/plain'
    }
});

// Copy interceptors from the main API client
const mainClient = getApiClient();
analyticsApi.interceptors.request = mainClient.interceptors.request;
analyticsApi.interceptors.response = mainClient.interceptors.response;
staffApi.interceptors.request = mainClient.interceptors.request;
staffApi.interceptors.response = mainClient.interceptors.response;

/**
 * Fetch all conversation messages
 * @returns {Promise<Array>} - Array of conversation messages
 */
export const fetchConversationMessages = async () => {
    try {
        // In development, use /api prefix due to proxy. In production, call directly without /api prefix
        const endpoint = import.meta.env.DEV 
            ? '/api/UserChatHistory/All' 
            : '/UserChatHistory/All';
        
        const response = await analyticsApi.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching conversation messages:', error);
        console.error('API endpoint:', import.meta.env.DEV ? 'Development with proxy' : 'Production direct');
        console.error('Base URL:', analyticsApi.defaults.baseURL);
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

/**
 * Fetch doctor details from Staff API
 * @returns {Promise<Object>} - Doctor details object
 */
export const fetchDoctorDetails = async () => {
    try {
        // In development, proxy will handle the routing. In production, call directly
        const endpoint = import.meta.env.DEV 
            ? '/api/Staff/GetDoctorDetails'  // Use proxy in development
            : '/Staff/GetDoctorDetails';     // Direct call in production
        
        console.log('Fetching doctor details from:', endpoint);
        console.log('Staff API Base URL:', staffApi.defaults.baseURL);
        console.log('Environment:', import.meta.env.DEV ? 'Development' : 'Production');
        
        const response = await staffApi.get(endpoint);
        console.log('Doctor details response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        console.error('Request details:', {
            baseURL: staffApi.defaults.baseURL,
            endpoint: import.meta.env.DEV ? '/api/Staff/GetDoctorDetails' : '/Staff/GetDoctorDetails',
            environment: import.meta.env.DEV ? 'Development' : 'Production'
        });
        throw error;
    }
};

/**
 * Fetch leads data from BookNowClicks API
 * @returns {Promise<Array>} - Array of leads data
 */
export const fetchLeads = async () => {
    try {
        // In development, proxy will handle the routing. In production, call directly
        const endpoint = import.meta.env.DEV 
            ? '/api/BookNowClicks/All'  // Use proxy in development
            : '/BookNowClicks/All';     // Direct call in production
        
        console.log('Fetching leads from:', endpoint);
        console.log('Analytics API Base URL:', analyticsApi.defaults.baseURL);
        console.log('Environment:', import.meta.env.DEV ? 'Development' : 'Production');
        
        const response = await analyticsApi.get(endpoint);
        console.log('Leads response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching leads:', error);
        console.error('Request details:', {
            baseURL: analyticsApi.defaults.baseURL,
            endpoint: import.meta.env.DEV ? '/api/BookNowClicks/All' : '/BookNowClicks/All',
            environment: import.meta.env.DEV ? 'Development' : 'Production'
        });
        throw error;
    }
};
