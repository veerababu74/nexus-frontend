import { api } from '../utils/apiClient';
import '../config/apiConfig'; // Initialize API configuration

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
        // Headers will include: Authorization: Bearer <token>, Content-Type: application/json
        const response = await api.get('/nexusai/knowledge/all');
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
        throw error;
    }
};
