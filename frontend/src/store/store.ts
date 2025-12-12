import { configureStore } from '@reduxjs/toolkit';
import vehicleReducer from './vehicleSlice';
import alertReducer from './alertSlice';

export const store = configureStore({
    reducer: {
        vehicles: vehicleReducer,
        alerts: alertReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
