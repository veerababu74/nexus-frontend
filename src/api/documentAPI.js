import axios from 'axios';

const API_BASE_URL = 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net';

export const uploadDocument = async ({ file, index_name, tag }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('index_name', index_name);
    if (tag) formData.append('tag', tag);
    try {
        const response = await axios.post(`${API_BASE_URL}/nexusai/upload_document`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
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
        console.log('API URL:', `${API_BASE_URL}/nexusai/delete_document`);

        const requestBody = { 
            index_name, 
            file_unique_id 
        };
        console.log('Request body:', requestBody);

        // Try with fetch first as alternative to axios
        const fetchResponse = await fetch(`${API_BASE_URL}/nexusai/delete_document`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Delete response status:', fetchResponse.status);
        console.log('Delete response ok:', fetchResponse.ok);

        const responseText = await fetchResponse.text();
        console.log('Raw response text:', responseText);

        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse response as JSON:', parseError);
            responseData = responseText;
        }

        console.log('Parsed response data:', responseData);

        if (!fetchResponse.ok) {
            throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`);
        }

        return responseData;

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
        const response = await axios.get(`${API_BASE_URL}/nexusai/knowledge/all`);
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
        throw error;
    }
};
