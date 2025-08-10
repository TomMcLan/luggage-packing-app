import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://luggage-packing-app-production.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const apiService = {
  // Get all luggage sizes
  getLuggageSizes: async () => {
    const response = await api.get('/api/luggage');
    return response.luggage_sizes;
  },

  // Select luggage size
  selectLuggage: async (size) => {
    const response = await api.post('/api/luggage/select', { size });
    return response.luggage;
  },

  // Detect items in image
  detectItems: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/api/items/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // Longer timeout for image processing
    });
    
    return response;
  },

  // Generate visual packing with AI
  generateVisualPacking: async (imageFile, luggageSize) => {
    console.log('Generating visual packing with:', { imageFile: imageFile?.name, luggageSize, apiUrl: API_BASE_URL });
    
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('luggage_size', luggageSize);
    
    const response = await api.post('/api/generate-packing-visuals', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // Extra long timeout for AI image generation
    });
    
    console.log('Visual packing response:', response);
    return response;
  },

  // Get packing recommendations
  getRecommendations: async (items, luggageSize, sessionId = null) => {
    const response = await api.post('/api/recommendations', {
      items,
      luggage_size: luggageSize,
      session_id: sessionId,
    });
    
    return response;
  },

  // Get all packing methods
  getPackingMethods: async () => {
    const response = await api.get('/api/methods');
    return response.methods;
  },
};

export default api;