import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Vehicle, Telemetry } from '../types';

interface VehicleState {
    vehicles: Vehicle[];
    telemetryData: Record<string, Telemetry>;
    loading: boolean;
    selectedVehicleId: string | null;
}

const initialState: VehicleState = {
    vehicles: [],
    telemetryData: {},
    loading: false,
    selectedVehicleId: null,
};

const vehicleSlice = createSlice({
    name: 'vehicles',
    initialState,
    reducers: {
        setVehicles(state, action: PayloadAction<Vehicle[]>) {
            state.vehicles = action.payload;
        },
        updateTelemetry(state, action: PayloadAction<Telemetry | Telemetry[]>) {
            const data = Array.isArray(action.payload) ? action.payload : [action.payload];
            data.forEach(t => {
                state.telemetryData[t.vehicle_id] = t;
                // Also update vehicle list status if needed (optional)
            });
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setSelectedVehicle(state, action: PayloadAction<string | null>) {
            state.selectedVehicleId = action.payload;
        }
    },
});

export const { setVehicles, updateTelemetry, setLoading, setSelectedVehicle } = vehicleSlice.actions;
export default vehicleSlice.reducer;
