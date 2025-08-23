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
        const response = await axios.delete(`${API_BASE_URL}/nexusai/delete_document`, {
            data: { index_name, file_unique_id },
            headers: {
                'Content-Type': 'application/json',
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
