import { Router } from 'express';
import { list, detail } from '../controllers/incidents.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { incidentQuerySchema } from '../schemas/incident.schema.js';

const router = Router();
router.use(requireAuth, requireRole('operator', 'admin'));
router.get('/', validate(incidentQuerySchema, 'query'), list);
router.get('/:id', detail);

export default router;
