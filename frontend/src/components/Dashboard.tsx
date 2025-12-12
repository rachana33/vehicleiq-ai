import React from 'react';
import { Box, Grid } from '@mui/material';
import VehicleMap from './VehicleMap';
import VehicleList from './VehicleList';
import MetricsPanel from './MetricsPanel';
import AlertsPanel from './AlertsPanel';
import AIChat from './AIChat';
import GlassLayout from './GlassLayout';

const Dashboard: React.FC = () => {
    return (
        <GlassLayout>
            <Grid container spacing={3} sx={{ height: 'calc(100vh - 100px)' }}>
                {/* Top Metrics Row */}
                <Grid size={{ xs: 12 }}>
                    <MetricsPanel />
                </Grid>

                {/* Main Content: Map (Left/Center) & Sidebar (Right) */}
                <Grid size={{ xs: 12, md: 8, lg: 9 }} sx={{ height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Map takes mostly full height */}
                    <Box sx={{ flexGrow: 1, height: '100%', minHeight: '400px', position: 'relative' }}>
                        <VehicleMap />
                    </Box>
                    {/* Vehicle List below map for easy access, or could be side */}
                    <Box sx={{ height: '300px' }}>
                        <VehicleList />
                    </Box>
                </Grid>

                {/* Right Sidebar: Chat & Alerts */}
                <Grid size={{ xs: 12, md: 4, lg: 3 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <AlertsPanel />
                    <AIChat />
                </Grid>
            </Grid>
        </GlassLayout>
    );
};

export default Dashboard;
