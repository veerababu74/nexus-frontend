// Debug script to test delete API directly
import axios from 'axios';

const API_BASE_URL = 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net';

const testDeleteAPI = async () => {
    console.log('Testing delete API...');
    
    // Replace with actual values for testing
    const testData = {
        index_name: 'test',
        file_unique_id: 'YOUR_FILE_ID_HERE' // Replace with actual file ID
    };
    
    try {
        console.log('Making delete request with:', testData);
        console.log('URL:', `${API_BASE_URL}/nexusai/delete_document`);
        
        const response = await axios.delete(`${API_BASE_URL}/nexusai/delete_document`, {
            data: testData,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        console.log('SUCCESS - Response:', response.data);
        return response.data;
        
    } catch (error) {
        console.error('ERROR - Full error object:', error);
        console.error('ERROR - Response status:', error.response?.status);
        console.error('ERROR - Response data:', error.response?.data);
        console.error('ERROR - Request config:', {
            url: error.config?.url,
            method: error.config?.method,
            data: error.config?.data,
            headers: error.config?.headers
        });
        
        if (error.response?.data) {
            console.error('Server error details:', error.response.data);
        }
        
        throw error;
    }
};

// Uncomment and run this to test
// testDeleteAPI();

console.log('Debug script loaded. Call testDeleteAPI() to test the delete API.');
