import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, Button } from '@mui/material';
import { setSelectedVehicle } from '../store/vehicleSlice';

// Memoized helper component for individual rows
const VehicleRow = React.memo(({ vehicle, telemetry, isSelected, onSelect }: { vehicle: any, telemetry: any, isSelected: boolean, onSelect: () => void }) => {
    const speed = telemetry ? telemetry.speed.toFixed(0) : '-';
    const fuel = telemetry ? telemetry.fuel_level.toFixed(0) : '-';
    const temp = telemetry ? telemetry.engine_temp.toFixed(0) : '-';

    return (
        <TableRow
            hover
            selected={isSelected}
            onClick={onSelect}
            sx={{ cursor: 'pointer', '&.Mui-selected': { borderLeft: '4px solid #00e5ff' } }}
        >
            <TableCell>{vehicle.vehicle_id}</TableCell>
            <TableCell>{vehicle.make} {vehicle.model}</TableCell>
            <TableCell>
                <Chip
                    label={vehicle.status}
                    size="small"
                    color={vehicle.status === 'active' ? 'success' : 'default'}
                />
            </TableCell>
            <TableCell>{speed} km/h</TableCell>
            <TableCell>{fuel}%</TableCell>
            <TableCell>{temp}°C</TableCell>
            <TableCell>
                <Button
                    size="small"
                    variant={isSelected ? "contained" : "outlined"}
                    color={isSelected ? "primary" : "inherit"}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect();
                    }}
                >
                    {isSelected ? 'Viewing' : 'View'}
                </Button>
            </TableCell>
        </TableRow>
    );
}, (prev, next) => {
    return (
        prev.vehicle === next.vehicle &&
        prev.telemetry === next.telemetry &&
        prev.isSelected === next.isSelected
    );
});

const VehicleList: React.FC = () => {
    const dispatch = useDispatch();
    const { vehicles, telemetryData, selectedVehicleId } = useSelector((state: RootState) => state.vehicles);

    return (
        <Paper elevation={3} sx={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                Fleet Vehicles
            </Typography>
            <TableContainer sx={{ flexGrow: 1 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Model</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Speed</TableCell>
                            <TableCell>Fuel</TableCell>
                            <TableCell>Temp</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vehicles.map((vehicle) => (
                            <VehicleRow
                                key={vehicle.vehicle_id}
                                vehicle={vehicle}
                                telemetry={telemetryData[vehicle.vehicle_id]}
                                isSelected={vehicle.vehicle_id === selectedVehicleId}
                                onSelect={() => dispatch(setSelectedVehicle(vehicle.vehicle_id))}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default VehicleList;
