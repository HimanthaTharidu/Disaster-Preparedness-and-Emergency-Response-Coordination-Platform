import { Router } from 'express';
import { login, refresh, logout, me } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { loginSchema, refreshSchema } from '../schemas/auth.schema.js';

const router = Router();
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshSchema), refresh);
router.post('/logout', validate(refreshSchema), logout);
router.get('/me', requireAuth, me);

export default router;
