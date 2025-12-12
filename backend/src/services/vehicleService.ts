import pool from '../db/connection';
import redisClient from '../utils/redis';

export const vehicleService = {
    async getAllVehicles() {
        // Try cache first
        const cacheKey = 'vehicles:all';
        try {
            const cached = await redisClient.get(cacheKey);
            if (cached) return JSON.parse(cached);
        } catch (e) {
            console.error('Redis get error', e);
        }

        const result = await pool.query('SELECT * FROM vehicles ORDER BY vehicle_id');
        const vehicles = result.rows;

        // Cache results
        try {
            await redisClient.set(cacheKey, JSON.stringify(vehicles), { EX: 30 });
        } catch (e) {
            console.error('Redis set error', e);
        }

        return vehicles;
    },

    async getVehicleById(vehicleId: string) {
        const result = await pool.query('SELECT * FROM vehicles WHERE vehicle_id = $1', [vehicleId]);
        return result.rows[0];
    },

    async getTelemetryHistory(vehicleId: string, hours: number = 24) {
        const result = await pool.query(
            `SELECT * FROM telemetry 
           WHERE vehicle_id = $1 
           AND timestamp >= datetime('now', '-' || $2 || ' hours')
           ORDER BY timestamp ASC`,
            [vehicleId, hours] // Pass hours as param to be safe/cleaner
        );
        return result.rows;
    }
};
