import axios from 'axios';
import { config } from '@/config';

const apiBaseURL = config.apiUrl + '/api';
const aiBaseURL = config.aiUrl + '/api/ai';

console.log('🌐 API Base URL:', apiBaseURL);
console.log('🤖 AI Base URL:', aiBaseURL);

const api = axios.create({
    baseURL: apiBaseURL,
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
    baseURL: aiBaseURL,
    headers: { 'Content-Type': 'application/json' }
});

export const aiService = {
    chat: (question: string) => aiApi.post('/chat', { question }),
    predictMaintenance: (vehicleId: string) => aiApi.get(`/predict-maintenance/${vehicleId}`)
};

export default api;
