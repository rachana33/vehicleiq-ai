import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Button } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { alertApi } from '../services/api';
import { setAlerts, acknowledgeAlert } from '../store/alertSlice';

const AlertsPanel: React.FC = () => {
    const dispatch = useDispatch();
    const { alerts } = useSelector((state: RootState) => state.alerts);

    useEffect(() => {
        // Fetch initially
        alertApi.getActive().then(res => {
            dispatch(setAlerts(res.data));
        });
    }, [dispatch]);

    const handleAcknowledge = async (id: number) => {
        try {
            await alertApi.acknowledge(id);
            dispatch(acknowledgeAlert(id));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Paper elevation={3} sx={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                System Alerts ({alerts.filter(a => !a.acknowledged).length})
            </Typography>
            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                {alerts.length === 0 && (
                    <Typography variant="body2" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                        No active alerts
                    </Typography>
                )}
                {alerts.map((alert) => (
                    <ListItem key={alert.id} divider>
                        <ListItemIcon>
                            {alert.severity > 1 ? <ErrorIcon color="error" /> : <WarningIcon color="warning" />}
                        </ListItemIcon>
                        <ListItemText
                            primary={`${alert.alert_type} - ${alert.vehicle_id}`}
                            secondary={alert.message}
                        />
                        {!alert.acknowledged ? (
                            <Button size="small" onClick={() => handleAcknowledge(alert.id)}>
                                Ack
                            </Button>
                        ) : (
                            <CheckCircleIcon color="disabled" fontSize="small" />
                        )}
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default AlertsPanel;
