import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { vehicleApi } from '../services/api';

const ChartsPanel: React.FC = () => {
    const { vehicles } = useSelector((state: RootState) => state.vehicles);
    const [selectedVehicle, setVehicle] = useState<string>('');
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        if (vehicles.length > 0 && !selectedVehicle) {
            setVehicle(vehicles[0].vehicle_id);
        }
    }, [vehicles]);

    useEffect(() => {
        if (selectedVehicle) {
            vehicleApi.getHistory(selectedVehicle).then(res => {
                // Process data for charts
                const processed = res.data.map((d: any) => ({
                    ...d,
                    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
                setHistory(processed);
            }).catch(console.error);
        }
    }, [selectedVehicle]);

    const handleChange = (event: SelectChangeEvent) => {
        setVehicle(event.target.value as string);
    };

    return (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Historical Telemetry</Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Vehicle</InputLabel>
                    <Select value={selectedVehicle} label="Vehicle" onChange={handleChange}>
                        {vehicles.map(v => (
                            <MenuItem key={v.vehicle_id} value={v.vehicle_id}>{v.vehicle_id}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer>
                    <LineChart data={history}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="speed" stroke="#8884d8" name="Speed (km/h)" />
                        <Line yAxisId="right" type="monotone" dataKey="engine_temp" stroke="#82ca9d" name="Temp (°C)" />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default ChartsPanel;
