import axios from 'axios';

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api',
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

// AI Service API
const aiApi = axios.create({
    baseURL: (import.meta.env.VITE_AI_URL || 'http://localhost:5001') + '/api/ai',
    headers: { 'Content-Type': 'application/json' }
});

export const aiService = {
    chat: (question: string) => aiApi.post('/chat', { question }),
    predictMaintenance: (vehicleId: string) => aiApi.get(`/predict-maintenance/${vehicleId}`)
};

export default api;
