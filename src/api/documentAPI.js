import { api, setApiBaseUrl } from '../utils/apiClient';

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV 
    ? '' 
    : 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net';

// Configure the API client with the base URL if not in development
if (!import.meta.env.DEV) {
    setApiBaseUrl(API_BASE_URL);
}

export const uploadDocument = async ({ file, index_name, tag }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('index_name', index_name);
    if (tag) formData.append('tag', tag);
    
    try {
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
        const response = await api.get('/nexusai/knowledge/all');
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
        throw error;
    }
};
