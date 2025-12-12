import { Request, Response } from 'express';
import pool from '../db/connection';

export const alertController = {
    async getActiveAlerts(req: Request, res: Response) {
        try {
            const result = await pool.query(
                'SELECT * FROM alerts WHERE acknowledged = false ORDER BY created_at DESC'
            );
            res.json(result.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getVehicleAlerts(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await pool.query(
                'SELECT * FROM alerts WHERE vehicle_id = $1 ORDER BY created_at DESC',
                [id]
            );
            res.json(result.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async acknowledgeAlert(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await pool.query(
                'UPDATE alerts SET acknowledged = true WHERE id = $1 RETURNING *',
                [id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Alert not found' });
            }
            res.json(result.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
