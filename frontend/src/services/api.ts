import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const vehicleApi = {
    getAll: () => api.get('/vehicles'),
    getById: (id: string) => api.get(`/vehicles/${id}`),
    getHistory: (id: string) => api.get(`/vehicles/${id}/history`),
};

export const alertApi = {
    getActive: () => api.get('/alerts'),
    acknowledge: (id: number) => api.post(`/alerts/${id}/acknowledge`),
};

// AI Service API (might be on different port or proxied)
// In dev: proxy via backend or direct. For demo, assuming direct call to 5000 or proxied.
// Let's assume ai-service is on 5000 and we call it directly or via backend proxy.
// Ideally, setup proxy in vite.config.ts. For now, let's use a separate client or just assume same base if proxied.
// Prompt said ai service is separate. Let's create specific client for AI.
const aiApi = axios.create({
    baseURL: 'http://localhost:5001/api/ai', // Updated to 5001 to avoid MacOS AirPlay conflict
    headers: { 'Content-Type': 'application/json' }
});

export const aiService = {
    chat: (question: string) => aiApi.post('/chat', { question }),
    predictMaintenance: (vehicleId: string) => aiApi.get(`/predict-maintenance/${vehicleId}`)
};

export default api;
