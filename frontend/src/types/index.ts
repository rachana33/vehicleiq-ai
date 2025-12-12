export interface Vehicle {
    id: number;
    vehicle_id: string;
    make: string;
    model: string;
    status: 'active' | 'idle' | 'maintenance' | 'autonomous';
    last_maintenance_date: string;
    odometer: number;
    heading: number;
    // Aptiv-style sensors
    lidar_active?: boolean;
    radar_objects?: number;
    camera_status?: 'ok' | 'warning' | 'error';
    emergency_braking?: boolean;
}

export interface Telemetry {
    vehicle_id: string;
    timestamp: string;
    latitude: number;
    longitude: number;
    speed: number;
    fuel_level: number;
    engine_temp: number;
    battery_voltage: number;
    odometer: number;
    // Aptiv-style sensors
    lidar_active?: boolean;
    radar_objects?: number;
    camera_status?: 'ok' | 'warning' | 'error';
    emergency_braking?: boolean;
}

export interface Alert {
    id: number;
    vehicle_id: string;
    alert_type: string;
    message: string;
    severity: number;
    acknowledged: boolean;
    created_at: string;
}

export interface MaintenancePrediction {
    vehicle_id: string;
    needs_maintenance: boolean;
    confidence: number;
    days_until_maintenance: number;
}
