import { Router } from 'express';

import { authenticate } from '../../middleware/auth.middleware';
import { rbac } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  createUserHandler,
  deactivateUserHandler,
  getUserByIdHandler,
  listUsersHandler,
  updateUserHandler,
} from './users.controller';
import {
  createUserSchema,
  listUsersSchema,
  updateUserSchema,
  userIdParamSchema,
} from './users.schema';

const router = Router();

// Protect ALL user management routes with Authentication + Admin RBAC
router.use(authenticate, rbac(['ADMIN']));

// GET /api/v1/users - List users with search & pagination
router.get('/', validate(listUsersSchema), listUsersHandler);

// POST /api/v1/users - Create new user
router.post('/', validate(createUserSchema), createUserHandler);

// GET /api/v1/users/:id - Get single user details
router.get('/:id', validate(userIdParamSchema), getUserByIdHandler);

// PATCH /api/v1/users/:id - Update user details/role/status
router.patch('/:id', validate(updateUserSchema), updateUserHandler);

// DELETE /api/v1/users/:id - Deactivate user
router.delete('/:id', validate(userIdParamSchema), deactivateUserHandler);

export default router;
