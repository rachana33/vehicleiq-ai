import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import { socketService } from './services/socket';
import { vehicleApi } from './services/api';
import { setVehicles, updateTelemetry } from './store/vehicleSlice';
import BackendSyncPopup from './components/BackendSyncPopup';
import api from './services/api';
import { mockVehicles, mockTelemetryData, getUpdatedMockTelemetry } from './data/mockData';

type SyncStatus = 'connecting' | 'syncing' | 'ready' | 'demo';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const [backendStatus, setBackendStatus] = useState<SyncStatus>('connecting');
  const [showPopup, setShowPopup] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5; // Reduced retries - fail faster to demo mode
    const retryDelay = 2000; // 2 seconds between retries
    let demoInterval: ReturnType<typeof setInterval>;

    const startDemoMode = () => {
      console.log('🎭 Starting Demo Mode with mock data...');
      setIsDemoMode(true);
      setBackendStatus('demo');

      // Load mock vehicles
      dispatch(setVehicles(mockVehicles));

      // Initialize mock telemetry
      Object.values(mockTelemetryData).forEach((telemetry) => {
        dispatch(updateTelemetry(telemetry));
      });

      // Simulate real-time updates in demo mode
      demoInterval = setInterval(() => {
        mockVehicles.forEach(vehicle => {
          const updatedTelemetry = getUpdatedMockTelemetry(vehicle.vehicle_id);
          if (updatedTelemetry) {
            dispatch(updateTelemetry(updatedTelemetry));
          }
        });
      }, 5000); // Update every 5 seconds

      // Hide popup after showing demo mode message
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    };

    const checkBackendHealth = async () => {
      try {
        // Try to ping the backend health endpoint or fetch vehicles
        await api.get('/health').catch(() => api.get('/vehicles'));

        // Backend is responding
        setBackendStatus('syncing');

        // Give it a moment to fully initialize
        setTimeout(async () => {
          try {
            // Fetch initial data
            const res = await vehicleApi.getAll();
            dispatch(setVehicles(res.data));

            // Connect WebSocket
            socketService.connect();

            // Mark as ready
            setBackendStatus('ready');
            setIsDemoMode(false);

            // Hide popup after a brief success message
            setTimeout(() => {
              setShowPopup(false);
            }, 1000);
          } catch (err) {
            console.error('Error loading initial data:', err);
            // Fall back to demo mode
            startDemoMode();
          }
        }, 1500);
      } catch (err) {
        console.log(`Backend not ready yet (attempt ${retryCount + 1}/${maxRetries})...`);

        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(checkBackendHealth, retryDelay);
        } else {
          // Backend unreachable - start demo mode
          startDemoMode();
        }
      }
    };

    checkBackendHealth();

    return () => {
      socketService.disconnect();
      if (demoInterval) clearInterval(demoInterval);
    };
  }, [dispatch]);

  return (
    <>
      <BackendSyncPopup
        isVisible={showPopup}
        status={backendStatus}
        message={isDemoMode ? 'Running in demo mode with sample data' : ''}
      />
      {isDemoMode && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg border border-purple-300/30 animate-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span className="font-medium">Demo Mode</span>
          </div>
        </div>
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
