import { io, Socket } from 'socket.io-client';
import { store } from '../store/store';
import { updateTelemetry, setVehicles } from '../store/vehicleSlice';
import { addAlert } from '../store/alertSlice';
import { config } from '@/config';

class SocketService {
    private socket: Socket | null = null;

    connect() {
        if (this.socket) return;

        // Use the same base URL as the API (without /api path)
        const wsUrl = config.apiUrl;
        console.log('🔌 Connecting to WebSocket:', wsUrl);

        this.socket = io(wsUrl);

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        this.socket.on('initial-state', (vehicles) => {
            // Not used currently as we fetch from API mostly, but simulator emits it maybe?
            // Actually simulator emits telemetry. 
        });

        this.socket.on('telemetry', (data) => {
            store.dispatch(updateTelemetry(data));
        });

        this.socket.on('alert', (alert) => {
            store.dispatch(addAlert(alert));
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket');
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const socketService = new SocketService();
