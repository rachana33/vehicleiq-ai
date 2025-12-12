import { useState, useEffect, useCallback } from 'react';

export interface Vehicle {
  id: string;
  model: string;
  status: 'active' | 'idle' | 'maintenance';
  speed: number;
  fuel: number;
  temp: number;
  lat: number;
  lng: number;
}

const initialVehicles: Vehicle[] = [
  { id: 'VEH-001', model: 'Toyota Camry', status: 'active', speed: 16, fuel: 69, temp: 88, lat: 37.7749, lng: -122.4194 },
  { id: 'VEH-002', model: 'Honda Accord', status: 'active', speed: 24, fuel: 59, temp: 94, lat: 37.7849, lng: -122.4094 },
  { id: 'VEH-003', model: 'Ford F-150', status: 'active', speed: 0, fuel: 77, temp: 102, lat: 37.7649, lng: -122.4294 },
  { id: 'VEH-004', model: 'Tesla Model 3', status: 'active', speed: 16, fuel: 85, temp: 93, lat: 37.7749, lng: -122.3994 },
  { id: 'VEH-005', model: 'Chevrolet Silverado', status: 'active', speed: 78, fuel: 62, temp: 103, lat: 37.7549, lng: -122.4194 },
  { id: 'VEH-006', model: 'Toyota RAV4', status: 'active', speed: 13, fuel: 53, temp: 90, lat: 37.7849, lng: -122.4394 },
  { id: 'VEH-007', model: 'Honda CR-V', status: 'active', speed: 13, fuel: 92, temp: 91, lat: 37.7649, lng: -122.4094 },
  { id: 'VEH-008', model: 'BMW X5', status: 'idle', speed: 0, fuel: 45, temp: 85, lat: 37.7949, lng: -122.4294 },
  { id: 'VEH-009', model: 'Mercedes GLE', status: 'active', speed: 45, fuel: 38, temp: 104, lat: 37.7449, lng: -122.4194 },
  { id: 'VEH-010', model: 'Audi Q7', status: 'active', speed: 22, fuel: 71, temp: 101, lat: 37.7749, lng: -122.4494 },
];

export const useVehicleSimulation = (intervalMs: number = 3000) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [isSimulating, setIsSimulating] = useState(true);

  const simulateUpdate = useCallback(() => {
    setVehicles((prev) =>
      prev.map((vehicle) => {
        if (vehicle.status === 'maintenance') return vehicle;

        const isMoving = vehicle.status === 'active' && vehicle.speed > 0;
        
        // Random speed changes
        let newSpeed = vehicle.speed;
        if (vehicle.status === 'active') {
          const speedChange = (Math.random() - 0.5) * 10;
          newSpeed = Math.max(0, Math.min(120, vehicle.speed + speedChange));
        }

        // Fuel consumption (slower for idle vehicles)
        const fuelConsumption = isMoving ? Math.random() * 0.3 : Math.random() * 0.05;
        const newFuel = Math.max(0, vehicle.fuel - fuelConsumption);

        // Temperature fluctuation
        const tempChange = (Math.random() - 0.5) * 3;
        const newTemp = Math.max(70, Math.min(110, vehicle.temp + tempChange));

        // Position updates for moving vehicles
        let newLat = vehicle.lat;
        let newLng = vehicle.lng;
        if (isMoving) {
          newLat += (Math.random() - 0.5) * 0.002;
          newLng += (Math.random() - 0.5) * 0.002;
        }

        // Status changes (rare)
        let newStatus = vehicle.status;
        if (Math.random() < 0.02) {
          newStatus = vehicle.status === 'active' ? 'idle' : 'active';
          if (newStatus === 'idle') newSpeed = 0;
        }

        return {
          ...vehicle,
          speed: Math.round(newSpeed),
          fuel: Math.round(newFuel * 10) / 10,
          temp: Math.round(newTemp),
          lat: newLat,
          lng: newLng,
          status: newStatus,
        };
      })
    );
  }, []);

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(simulateUpdate, intervalMs);
    return () => clearInterval(interval);
  }, [isSimulating, intervalMs, simulateUpdate]);

  const toggleSimulation = () => setIsSimulating((prev) => !prev);

  return { vehicles, isSimulating, toggleSimulation };
};
