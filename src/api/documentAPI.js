import { api } from '../utils/apiClient';
import axios from 'axios';
import { getAccessTokenCookie, isTokenExpired } from '../utils/cookieUtils';
import '../config/apiConfig'; // Initialize API configuration

// Knowledge API base URL
const KNOWLEDGE_API_BASE_URL = 'https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net';

// Create a specific axios instance for knowledge API
const knowledgeApiClient = axios.create({
  baseURL: KNOWLEDGE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
knowledgeApiClient.interceptors.request.use(
  (config) => {
    const token = getAccessTokenCookie();
    
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Knowledge API request interceptor error:', error);
    return Promise.reject(error);
  }
);

export const uploadDocument = async ({ file, index_name, tag }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('index_name', index_name);
    if (tag) formData.append('tag', tag);

    try {
        // The JWT token is automatically added by the API client interceptors
        const response = await api.upload('/nexusai/upload_document', formData);
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
        throw error;
    }
};

export const deleteDocument = async ({ index_name, file_unique_id }) => {
    try {
        console.log('Deleting document with params:', { index_name, file_unique_id });

        const requestBody = {
            index_name,
            file_unique_id
        };
        console.log('Request body:', requestBody);

        // The JWT token is automatically added by the API client interceptors
        const response = await api.delete('/nexusai/delete_document', {
            data: requestBody
        });

        console.log('Delete response status:', response.status);
        console.log('Delete response data:', response.data);

        return response.data;

    } catch (error) {
        console.error('Delete document error details:', {
            message: error.message,
            stack: error.stack,
        });

        // Re-throw with more context
        throw new Error(`Delete failed: ${error.message}`);
    }
};

export const getAllKnowledgeRecords = async () => {
    try {
        // The JWT token is automatically added by the API client interceptors
        const response = await knowledgeApiClient.get('/Knowledge/All');
        return response.data;
    } catch (error) {
        console.error('Error fetching knowledge records:', error);
        if (error.response) {
            return error.response.data;
        }
        throw error;
    }
};
