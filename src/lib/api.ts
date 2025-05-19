import axios from 'axios';

// Define API base URL - will be replaced with actual backend URL when deployed
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.serpstrategist.com' 
  : 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service for content strategy operations
export const contentStrategyService = {
  // Process input to generate content strategy
  processInput: async (input: string, domain: string = '') => {
    try {
      const response = await api.post('/api/process', { input, domain });
      return response.data;
    } catch (error) {
      console.error('Error processing input:', error);
      throw error;
    }
  },

  // Export content in specified format
  exportContent: async (contentType: string, formatId: string, contentData: any) => {
    try {
      const response = await api.post('/api/export', {
        content_type: contentType,
        format: formatId,
        content_data: contentData,
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting content:', error);
      throw error;
    }
  },

  // Publish content to CMS platform
  publishToCms: async (contentType: string, platformId: string, contentData: any, credentials: any) => {
    try {
      const response = await api.post('/api/publish', {
        content_type: contentType,
        platform: platformId,
        content_data: contentData,
        credentials,
      });
      return response.data;
    } catch (error) {
      console.error('Error publishing to CMS:', error);
      throw error;
    }
  },

  // Analyze URL content
  analyzeUrl: async (url: string) => {
    try {
      const response = await api.post('/api/analyze-url', { url });
      return response.data;
    } catch (error) {
      console.error('Error analyzing URL:', error);
      throw error;
    }
  },
};
