import pool from '../db/connection';
import { io } from '../server';
import redisClient from '../utils/redis';

interface VehicleState {
    vehicle_id: string;
    latitude: number;
    longitude: number;
    speed: number;
    fuel_level: number;
    engine_temp: number;
    battery_voltage: number;
    odometer: number;
    heading: number;
    // Sensors
    lidar_active: boolean;
    radar_objects: number;
    camera_status: 'ok' | 'warning' | 'error';
    emergency_braking: boolean;
}

export class VehicleSimulator {
    private vehicles: Map<string, VehicleState> = new Map();
    private updateInterval: NodeJS.Timeout | null = null;
    private saveInterval: NodeJS.Timeout | null = null;

    // Simulation parameters
    private readonly LAT_MIN = 47.4;
    private readonly LAT_MAX = 47.7;
    private readonly LNG_MIN = -122.4;
    private readonly LNG_MAX = -122.2;

    async initialize() {
        // Load initial states or create them
        const result = await pool.query('SELECT * FROM vehicles');
        const dbVehicles = result.rows;

        dbVehicles.forEach((v, index) => {
            // Seed random positions around Seattle
            const lat = this.LAT_MIN + (Math.random() * (this.LAT_MAX - this.LAT_MIN));
            const lng = this.LNG_MIN + (Math.random() * (this.LNG_MAX - this.LNG_MIN));

            this.vehicles.set(v.vehicle_id, {
                vehicle_id: v.vehicle_id,
                latitude: lat,
                longitude: lng,
                speed: 0,
                fuel_level: 100 - (Math.random() * 50),
                engine_temp: 85,
                battery_voltage: 13.5,
                odometer: v.odometer,
                heading: 0,
                lidar_active: true,
                radar_objects: 0,
                camera_status: 'ok',
                emergency_braking: false
            });
        });
        console.log(`Simulator initialized with ${this.vehicles.size} vehicles`);
    }

    start() {
        if (this.updateInterval) return;

        // Update state every 2 seconds
        this.updateInterval = setInterval(() => this.updateVehicles(), 2000);

        // Save telemetry every 10 seconds
        this.saveInterval = setInterval(() => this.saveTelemetry(), 10000);

        console.log('Vehicle Simulator started');
    }

    stop() {
        if (this.updateInterval) clearInterval(this.updateInterval);
        if (this.saveInterval) clearInterval(this.saveInterval);
        this.updateInterval = null;
        this.saveInterval = null;
    }

    getCurrentState() {
        return Array.from(this.vehicles.values());
    }

    private updateVehicles() {
        this.vehicles.forEach((vehicle, id) => {
            // Simulate movement
            if (Math.random() > 0.1) { // 90% chance to move
                const speed = Math.random() * 80; // 0-80 km/h
                vehicle.speed = speed;

                // Simulate movement
                // San Francisco approximate bounds:
                // Lat: 37.75 - 37.79 (approx 4km span)
                // Lon: -122.50 - -122.38 (approx 10km span)
                // Center roughly: 37.7749, -122.4194

                // Add small random movement to existing position or initialize in SF
                const moveLat = (Math.random() - 0.5) * 0.001; // Small step
                const moveLon = (Math.random() - 0.5) * 0.001;

                // Basic clamping/reset if wandering too far (simple geofence around SF)
                let newLat = (vehicle.latitude || 37.7749) + moveLat;
                let newLong = (vehicle.longitude || -122.4194) + moveLon;

                // If out of bounds, reset to center (SF)
                if (newLat < 37.70 || newLat > 37.81 || newLong < -122.52 || newLong > -122.35) {
                    newLat = 37.7749 + (Math.random() - 0.5) * 0.01;
                    newLong = -122.4194 + (Math.random() - 0.5) * 0.01;
                }

                // Calculate heading if moving
                if (speed > 0) {
                    const y = Math.sin(moveLon) * Math.cos(newLat);
                    const x = Math.cos(vehicle.latitude) * Math.sin(newLat) -
                        Math.sin(vehicle.latitude) * Math.cos(newLat) * Math.cos(moveLon);
                    const brng = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
                    vehicle.heading = brng;
                }

                vehicle.latitude = newLat;
                vehicle.longitude = newLong;

                // Update other metrics
                vehicle.fuel_level = Math.max(0, vehicle.fuel_level - (speed * 0.0005));
                vehicle.engine_temp = 85 + (speed * 0.2) + (Math.random() * 5);
                vehicle.battery_voltage = 13.5 + ((Math.random() - 0.5) * 1);
                vehicle.odometer += (speed / 3600) * 2; // Distance in 2 seconds

                // Simulate Sensor Data (Aptiv-style)
                vehicle.lidar_active = true; // Mostly true
                vehicle.radar_objects = Math.floor(Math.random() * 5); // 0-4 objects detected

                // Random camera glitches (1% chance)
                const camRoll = Math.random();
                vehicle.camera_status = camRoll > 0.99 ? 'error' : camRoll > 0.95 ? 'warning' : 'ok';

                // Emergency braking event (0.5% chance)
                vehicle.emergency_braking = Math.random() > 0.995;

                // Check alerts
                this.checkAlerts(vehicle);
            } else {
                vehicle.speed = 0;
                vehicle.radar_objects = 0;
                vehicle.emergency_braking = false;
            }
        });

        // Broadcast to clients
        io.emit('telemetry', Array.from(this.vehicles.values()));
    }

    private checkAlerts(vehicle: VehicleState) {
        if (vehicle.engine_temp > 100) {
            this.createAlert(vehicle.vehicle_id, 'High Temperature', `Engine temp is ${vehicle.engine_temp.toFixed(1)}°C`, 2);
        }
        if (vehicle.fuel_level < 15) {
            this.createAlert(vehicle.vehicle_id, 'Low Fuel', `Fuel level is ${vehicle.fuel_level.toFixed(1)}%`, 1);
        }
    }

    private async createAlert(vehicleId: string, type: string, message: string, severity: number) {
        // Simple deduplication - check if active alert exists (omitted for brevity in demo logic, but good to have)
        // For demo: emit immediately
        io.emit('alert', {
            vehicle_id: vehicleId,
            alert_type: type,
            message,
            severity,
            created_at: new Date().toISOString()
        });

        // Async save to DB
        try {
            await pool.query(
                'INSERT INTO alerts (vehicle_id, alert_type, message, severity) VALUES ($1, $2, $3, $4)',
                [vehicleId, type, message, severity]
            );
        } catch (e) {
            console.error('Error saving alert', e);
        }
    }

    private async saveTelemetry() {
        const batch = Array.from(this.vehicles.values());
        for (const v of batch) {
            try {
                await pool.query(
                    `INSERT INTO telemetry 
                    (vehicle_id, latitude, longitude, speed, fuel_level, engine_temp, battery_voltage, odometer)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [v.vehicle_id, v.latitude, v.longitude, v.speed, v.fuel_level, v.engine_temp, v.battery_voltage, Math.floor(v.odometer)]
                );
            } catch (e) {
                console.error(`Error saving telemetry for ${v.vehicle_id}`, e);
            }
        }
        // Also cache latest state in Redis
        try {
            await redisClient.set('vehicles:live', JSON.stringify(batch), { EX: 60 });
        } catch (e) {
            console.error('Redis set error', e);
        }
    }
}

export const simulator = new VehicleSimulator();
