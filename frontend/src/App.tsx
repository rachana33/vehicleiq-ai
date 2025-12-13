import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import { socketService } from './services/socket';
import { vehicleApi } from './services/api';
import { setVehicles } from './store/vehicleSlice';
import BackendSyncPopup from './components/BackendSyncPopup';
import api from './services/api';

type SyncStatus = 'connecting' | 'syncing' | 'ready' | 'error';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const [backendStatus, setBackendStatus] = useState<SyncStatus>('connecting');
  const [showPopup, setShowPopup] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 20; // Try for ~60 seconds (20 * 3s)
    const retryDelay = 3000; // 3 seconds between retries

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

            // Hide popup after a brief success message
            setTimeout(() => {
              setShowPopup(false);
            }, 1000);
          } catch (err) {
            console.error('Error loading initial data:', err);
            setBackendStatus('error');
            setErrorMessage('Failed to load vehicle data');
          }
        }, 1500);
      } catch (err) {
        console.log(`Backend not ready yet (attempt ${retryCount + 1}/${maxRetries})...`);

        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(checkBackendHealth, retryDelay);
        } else {
          setBackendStatus('error');
          setErrorMessage('Backend service is taking longer than expected. Please refresh the page.');
        }
      }
    };

    checkBackendHealth();

    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);

  return (
    <>
      <BackendSyncPopup
        isVisible={showPopup}
        status={backendStatus}
        message={errorMessage}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
