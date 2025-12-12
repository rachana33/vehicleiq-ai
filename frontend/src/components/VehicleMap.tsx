import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { setSelectedVehicle } from '../store/vehicleSlice';
import { Box, Paper, Typography } from '@mui/material';

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons could be added here based on status

const VehicleMap: React.FC = () => {
    const dispatch = useDispatch();
    const { telemetryData, vehicles, selectedVehicleId } = useSelector((state: RootState) => state.vehicles);
    const vehicleList = vehicles.length > 0 ? vehicles : [];

    // Seattle coordinates
    const center: [number, number] = [37.7749, -122.4194]; // Default SF

    // Component to handle map movement
    const MapController = () => {
        const map = useMap();
        const { selectedVehicleId, telemetryData } = useSelector((state: RootState) => state.vehicles);

        // Only fly to target when selection CHANGES, preventing "fighting" the user or lag loops
        useEffect(() => {
            if (selectedVehicleId && telemetryData[selectedVehicleId]) {
                const { latitude, longitude } = telemetryData[selectedVehicleId];
                // Use flyTo for the initial jump
                map.flyTo([latitude, longitude], 15, { duration: 1.5 });
            }
        }, [selectedVehicleId, map]); // Removed telemetryData from dependency to stop auto-following every 2s

        return null;
    };

    return (
        <Paper elevation={3} sx={{ height: '100%', minHeight: '400px', overflow: 'hidden' }}>
            <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }}>
                <MapController />
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {vehicleList.map((v) => {
                    const telem = telemetryData[v.vehicle_id];
                    if (!telem) return null;

                    const isSelected = v.vehicle_id === selectedVehicleId;

                    // Create custom neon icon
                    const neonIcon = L.divIcon({
                        className: 'custom-icon',
                        html: `<div style="
                            background-color: ${isSelected ? '#ffffff' : '#00e5ff'};
                            width: 12px;
                            height: 12px;
                            border-radius: 50%;
                            box-shadow: 0 0 10px ${isSelected ? '#ffffff' : '#00e5ff'}, 0 0 20px ${isSelected ? '#ffffff' : '#00e5ff'};
                            border: 2px solid #fff;
                        "></div>`,
                        iconSize: [12, 12],
                        iconAnchor: [6, 6]
                    });

                    return (
                        <Marker
                            key={v.vehicle_id}
                            position={[telem.latitude, telem.longitude]}
                            icon={neonIcon}
                            eventHandlers={{
                                click: () => {
                                    dispatch(setSelectedVehicle(v.vehicle_id));
                                }
                            }}
                        >
                            <Popup>
                                <Box sx={{ p: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#00e5ff' }}>
                                        {v.vehicle_id}
                                    </Typography>
                                    <Typography variant="body2">{v.make} {v.model}</Typography>
                                    <Typography variant="body2">Speed: {telem.speed.toFixed(1)} km/h</Typography>
                                    <Typography variant="body2">Fuel: {telem.fuel_level.toFixed(1)}%</Typography>
                                </Box>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </Paper>
    );
};

export default VehicleMap;
