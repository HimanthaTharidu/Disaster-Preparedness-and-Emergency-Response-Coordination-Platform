import { Router } from 'express';
import { login, me } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { loginSchema } from '../schemas/auth.schema.js';

const router = Router();
router.post('/login', validate(loginSchema), login);
router.get('/me', requireAuth, me);

export default router;
