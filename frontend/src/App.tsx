import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import { socketService } from './services/socket';
import { vehicleApi } from './services/api';
import { setVehicles } from './store/vehicleSlice';

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initial fetch
    vehicleApi.getAll()
      .then(res => dispatch(setVehicles(res.data)))
      .catch(console.error);

    // Connect WebSocket
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
