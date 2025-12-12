import { Router } from 'express';
import { alertController } from '../controllers/alertController';

const router = Router();

router.get('/', alertController.getActiveAlerts);
router.get('/vehicle/:id', alertController.getVehicleAlerts);
router.post('/:id/acknowledge', alertController.acknowledgeAlert);

export default router;
