import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const MetricsPanel: React.FC = () => {
    const { vehicles, telemetryData } = useSelector((state: RootState) => state.vehicles);

    // Calculate aggregate metrics
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(v => v.status === 'active').length;

    // Average Speed
    const telemetries = Object.values(telemetryData);
    const avgSpeed = telemetries.length > 0
        ? telemetries.reduce((acc, curr) => acc + curr.speed, 0) / telemetries.length
        : 0;

    // Fuel Low Alert Count (< 20%)
    const lowFuelCount = telemetries.filter(t => t.fuel_level < 20).length;

    // High Temp Alert Count (> 95)
    const highTempCount = telemetries.filter(t => t.engine_temp > 95).length;

    const cards = [
        { title: 'Fleet Status', value: `${activeVehicles}/${totalVehicles} Active`, icon: <DirectionsCarIcon color="primary" fontSize="large" />, sub: 'Vehicles on road' },
        { title: 'Avg Speed', value: `${avgSpeed.toFixed(1)} km/h`, icon: <SpeedIcon color="secondary" fontSize="large" />, sub: 'Fleet average' },
        { title: 'Low Fuel', value: lowFuelCount, icon: <LocalGasStationIcon color={lowFuelCount > 0 ? "error" : "success"} fontSize="large" />, sub: 'Vehicles < 20%' },
        { title: 'High Temp', value: highTempCount, icon: <ThermostatIcon color={highTempCount > 0 ? "error" : "info"} fontSize="large" />, sub: 'Vehicles > 95°C' },
    ];

    return (
        <Grid container spacing={2}>
            {cards.map((card, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography color="textSecondary" gutterBottom variant="subtitle2">
                                        {card.title}
                                    </Typography>
                                    <Typography variant="h5" component="div" fontWeight="bold">
                                        {card.value}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {card.sub}
                                    </Typography>
                                </Box>
                                {card.icon}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default MetricsPanel;
