import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Alert } from '../types';

interface AlertState {
    alerts: Alert[];
    unreadCount: number;
}

const initialState: AlertState = {
    alerts: [],
    unreadCount: 0,
};

const alertSlice = createSlice({
    name: 'alerts',
    initialState,
    reducers: {
        setAlerts(state, action: PayloadAction<Alert[]>) {
            state.alerts = action.payload;
            state.unreadCount = action.payload.filter(a => !a.acknowledged).length;
        },
        addAlert(state, action: PayloadAction<Alert>) {
            state.alerts.unshift(action.payload);
            state.unreadCount += 1;
        },
        acknowledgeAlert(state, action: PayloadAction<number>) {
            const alert = state.alerts.find(a => a.id === action.payload);
            if (alert && !alert.acknowledged) {
                alert.acknowledged = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        }
    },
});

export const { setAlerts, addAlert, acknowledgeAlert } = alertSlice.actions;
export default alertSlice.reducer;
