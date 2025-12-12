import pool from './connection';

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const getVehicleByid = async (vehicleId: string) => {
    return pool.query('SELECT * FROM vehicles WHERE vehicle_id = $1', [vehicleId]);
};

export const getAllVehicles = async () => {
    return pool.query('SELECT * FROM vehicles ORDER BY vehicle_id');
};
