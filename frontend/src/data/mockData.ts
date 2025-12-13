import type { Vehicle, Telemetry } from '../types';

// Mock data for demo mode when backend is unreachable
export const mockVehicles: Vehicle[] = [
    {
        id: 1,
        vehicle_id: 'VEH-001',
        make: 'Toyota',
        model: 'Camry',
        status: 'active',
        last_maintenance_date: '2023-11-01',
        odometer: 15234,
        heading: 45
    },
    {
        id: 2,
        vehicle_id: 'VEH-002',
        make: 'Honda',
        model: 'Civic',
        status: 'active',
        last_maintenance_date: '2023-10-15',
        odometer: 22100,
        heading: 90
    },
    {
        id: 3,
        vehicle_id: 'VEH-003',
        make: 'Ford',
        model: 'F-150',
        status: 'idle',
        last_maintenance_date: '2023-12-01',
        odometer: 8500,
        heading: 180
    },
    {
        id: 4,
        vehicle_id: 'VEH-004',
        make: 'Tesla',
        model: 'Model 3',
        status: 'active',
        last_maintenance_date: '2023-09-20',
        odometer: 12000,
        heading: 270
    },
    {
        id: 5,
        vehicle_id: 'VEH-005',
        make: 'Chevrolet',
        model: 'Silverado',
        status: 'maintenance',
        last_maintenance_date: '2023-08-10',
        odometer: 35000,
        heading: 0
    },
    {
        id: 6,
        vehicle_id: 'VEH-006',
        make: 'BMW',
        model: 'X5',
        status: 'active',
        last_maintenance_date: '2023-11-20',
        odometer: 45000,
        heading: 135
    },
    {
        id: 7,
        vehicle_id: 'VEH-007',
        make: 'Mercedes',
        model: 'Sprinter',
        status: 'active',
        last_maintenance_date: '2023-10-05',
        odometer: 28900,
        heading: 225
    },
    {
        id: 8,
        vehicle_id: 'VEH-008',
        make: 'Nissan',
        model: 'Altima',
        status: 'idle',
        last_maintenance_date: '2023-09-30',
        odometer: 19500,
        heading: 315
    },
    {
        id: 9,
        vehicle_id: 'VEH-009',
        make: 'Hyundai',
        model: 'Tucson',
        status: 'active',
        last_maintenance_date: '2023-12-10',
        odometer: 5600,
        heading: 60
    },
    {
        id: 10,
        vehicle_id: 'VEH-010',
        make: 'Volkswagen',
        model: 'Jetta',
        status: 'active',
        last_maintenance_date: '2023-11-15',
        odometer: 31200,
        heading: 300
    }
];

export const mockTelemetryData: Record<string, Telemetry> = {
    'VEH-001': {
        vehicle_id: 'VEH-001',
        latitude: 37.7749,
        longitude: -122.4194,
        speed: 45,
        fuel_level: 75,
        engine_temp: 85,
        battery_voltage: 12.6,
        odometer: 15234,
        timestamp: new Date().toISOString()
    },
    'VEH-002': {
        vehicle_id: 'VEH-002',
        latitude: 37.7849,
        longitude: -122.4094,
        speed: 32,
        fuel_level: 18,
        engine_temp: 82,
        battery_voltage: 12.4,
        odometer: 22100,
        timestamp: new Date().toISOString()
    },
    'VEH-003': {
        vehicle_id: 'VEH-003',
        latitude: 37.7649,
        longitude: -122.4294,
        speed: 0,
        fuel_level: 92,
        engine_temp: 70,
        battery_voltage: 12.8,
        odometer: 8500,
        timestamp: new Date().toISOString()
    },
    'VEH-004': {
        vehicle_id: 'VEH-004',
        latitude: 37.7949,
        longitude: -122.3994,
        speed: 58,
        fuel_level: 88,
        engine_temp: 78,
        battery_voltage: 13.2,
        odometer: 12000,
        timestamp: new Date().toISOString()
    },
    'VEH-005': {
        vehicle_id: 'VEH-005',
        latitude: 37.7549,
        longitude: -122.4394,
        speed: 0,
        fuel_level: 45,
        engine_temp: 65,
        battery_voltage: 11.8,
        odometer: 35000,
        timestamp: new Date().toISOString()
    },
    'VEH-006': {
        vehicle_id: 'VEH-006',
        latitude: 37.8049,
        longitude: -122.3894,
        speed: 62,
        fuel_level: 67,
        engine_temp: 98,
        battery_voltage: 12.5,
        odometer: 45000,
        timestamp: new Date().toISOString()
    },
    'VEH-007': {
        vehicle_id: 'VEH-007',
        latitude: 37.7449,
        longitude: -122.4494,
        speed: 41,
        fuel_level: 55,
        engine_temp: 88,
        battery_voltage: 12.7,
        odometer: 28900,
        timestamp: new Date().toISOString()
    },
    'VEH-008': {
        vehicle_id: 'VEH-008',
        latitude: 37.8149,
        longitude: -122.3794,
        speed: 0,
        fuel_level: 34,
        engine_temp: 72,
        battery_voltage: 12.3,
        odometer: 19500,
        timestamp: new Date().toISOString()
    },
    'VEH-009': {
        vehicle_id: 'VEH-009',
        latitude: 37.7349,
        longitude: -122.4594,
        speed: 48,
        fuel_level: 81,
        engine_temp: 102,
        battery_voltage: 12.6,
        odometer: 5600,
        timestamp: new Date().toISOString()
    },
    'VEH-010': {
        vehicle_id: 'VEH-010',
        latitude: 37.8249,
        longitude: -122.3694,
        speed: 55,
        fuel_level: 72,
        engine_temp: 90,
        battery_voltage: 12.9,
        odometer: 31200,
        timestamp: new Date().toISOString()
    }
};

export const mockHistoryData = Array.from({ length: 20 }, (_, i) => {
    const now = new Date();
    const timestamp = new Date(now.getTime() - (19 - i) * 5 * 60 * 1000); // 5 min intervals
    return {
        timestamp: timestamp.toISOString(),
        speed: 30 + Math.random() * 40,
        engine_temp: 75 + Math.random() * 20,
        fuel_level: 60 + Math.random() * 30,
        battery_voltage: 12 + Math.random() * 1.5
    };
});

// Simulate real-time updates for demo mode
export function getUpdatedMockTelemetry(vehicleId: string) {
    const base = mockTelemetryData[vehicleId];
    if (!base) return null;

    return {
        ...base,
        speed: Math.max(0, base.speed + (Math.random() - 0.5) * 10),
        fuel_level: Math.max(0, Math.min(100, base.fuel_level - Math.random() * 0.5)),
        engine_temp: Math.max(60, Math.min(110, base.engine_temp + (Math.random() - 0.5) * 5)),
        latitude: base.latitude + (Math.random() - 0.5) * 0.01,
        longitude: base.longitude + (Math.random() - 0.5) * 0.01,
        timestamp: new Date().toISOString()
    };
}
