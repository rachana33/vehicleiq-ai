import React from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Avatar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const drawerWidth = 240;

const GlassLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', background: '#14181f' }}>
            {/* Glass Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        background: 'rgba(20, 24, 31, 0.95)', // Nearly opaque dark blue
                        backdropFilter: 'blur(12px)',
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                        color: 'white'
                    },
                }}
            >
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
                    <DirectionsCarIcon sx={{ color: '#00e5ff', mr: 1, fontSize: 30 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #00e5ff, #d500f9)', backgroundClip: 'text', textFillColor: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        VehicleIQ
                    </Typography>
                </Toolbar>
                <Box sx={{ overflow: 'auto', mt: 2 }}>
                    <List>
                        {['Dashboard', 'Fleet View', 'Analytics', 'Drivers'].map((text, index) => (
                            <ListItem button key={text} selected={index === 0} sx={{
                                mb: 1,
                                mx: 1,
                                borderRadius: 1,
                                '&.Mui-selected': {
                                    background: 'rgba(0, 229, 255, 0.1)',
                                    borderLeft: '4px solid #00e5ff'
                                },
                                '&:hover': {
                                    background: 'rgba(255,255,255,0.05)'
                                }
                            }}>
                                <ListItemIcon sx={{ color: index === 0 ? '#00e5ff' : 'rgba(255,255,255,0.7)' }}>
                                    {index === 0 ? <DashboardIcon /> : index === 3 ? <PersonIcon /> : <SettingsIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: index === 0 ? 600 : 400 }} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Main Content Area */}
            <Box component="main" sx={{ flexGrow: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
                {/* Glass Header */}
                <AppBar position="static" elevation={0} sx={{
                    background: 'transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(5px)'
                }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'text.secondary', fontSize: '1rem' }}>
                            Overview
                        </Typography>
                        <IconButton sx={{ color: 'white' }}>
                            <NotificationsIcon />
                        </IconButton>
                        <Avatar sx={{ ml: 2, width: 32, height: 32, bgcolor: '#d500f9' }}>A</Avatar>
                    </Toolbar>
                </AppBar>

                {/* Dashboard Content */}
                <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default GlassLayout;
