import { Request, Response } from 'express';
import { vehicleService } from '../services/vehicleService';

export const vehicleController = {
    async getAllVehicles(req: Request, res: Response) {
        try {
            const vehicles = await vehicleService.getAllVehicles();
            res.json(vehicles);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getVehicleById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicle = await vehicleService.getVehicleById(id);
            if (!vehicle) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }
            res.json(vehicle);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getHistory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const hours = req.query.hours ? parseInt(req.query.hours as string) : 24;
            const history = await vehicleService.getTelemetryHistory(id, hours);
            res.json(history);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
