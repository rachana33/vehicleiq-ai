import { Router } from 'express';
import { vehicleController } from '../controllers/vehicleController';

const router = Router();

router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.get('/:id/history', vehicleController.getHistory);

export default router;
