import { Router } from 'express';

import { validate } from '../../middleware/validate.middleware';
import {
  changePasswordHandler,
  getMeHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
} from './auth.controller';
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from './auth.schema';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', validate(registerSchema), registerHandler);

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), loginHandler);

// POST /api/v1/auth/refresh  — no body validation; token comes from cookie
router.post('/refresh', refreshHandler);

// POST /api/v1/auth/logout   — no body validation; token comes from cookie
router.post('/logout', logoutHandler);

// GET /api/v1/auth/me        — protected (Task 18 will add authenticate middleware)
router.get('/me', getMeHandler);

// PATCH /api/v1/auth/password — protected (Task 18 will add authenticate middleware)
router.patch(
  '/password',
  validate(changePasswordSchema),
  changePasswordHandler,
);

export default router;
