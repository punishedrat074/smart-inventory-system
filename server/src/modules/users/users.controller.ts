import { type NextFunction, type Request, type Response } from 'express';

import { sendSuccess } from '../../utils/apiResponse.util';
import {
  type CreateUserInput,
  type ListUsersQuery,
  type UpdateUserInput,
} from './users.schema';
import * as usersService from './users.service';

/**
 * GET /api/v1/users
 * Returns paginated list of users (Admin only).
 */
export const listUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = req.query as unknown as ListUsersQuery;
    const { users, meta } = await usersService.listUsers(query);
    sendSuccess(res, users, 200, meta);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/users/:id
 * Returns single user details by ID (Admin only).
 */
export const getUserByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await usersService.getUserById(req.params.id);
    sendSuccess(res, { user });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/users
 * Creates a new user (Admin only).
 */
export const createUserHandler = async (
  req: Request<object, object, CreateUserInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await usersService.createUser(req.body);
    sendSuccess(res, { user }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/users/:id
 * Updates an existing user's details, role, or active status (Admin only).
 */
export const updateUserHandler = async (
  req: Request<{ id: string }, object, UpdateUserInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const currentAdminId = req.user!.id;
    const user = await usersService.updateUser(
      req.params.id,
      req.body,
      currentAdminId,
    );
    sendSuccess(res, { user });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/users/:id
 * Deactivates a user (Admin only).
 */
export const deactivateUserHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const currentAdminId = req.user!.id;
    const user = await usersService.deactivateUser(
      req.params.id,
      currentAdminId,
    );
    sendSuccess(res, {
      message: 'User deactivated successfully',
      user,
    });
  } catch (err) {
    next(err);
  }
};
