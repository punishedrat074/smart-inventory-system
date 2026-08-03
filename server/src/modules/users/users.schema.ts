import { z } from 'zod';

import { UserRole } from '../../generated/prisma';

// ─── List Users Query Schema ──────────────────────────────────────────────────
export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
    role: z.nativeEnum(UserRole).optional(),
    isActive: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .optional(),
  }),
});

// ─── Create User Schema ───────────────────────────────────────────────────────
export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').toLowerCase(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters'),
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    role: z.nativeEnum(UserRole).default(UserRole.EMPLOYEE),
  }),
});

// ─── Update User Schema ───────────────────────────────────────────────────────
export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID format'),
  }),
  body: z
    .object({
      firstName: z.string().min(1).max(100).optional(),
      lastName: z.string().min(1).max(100).optional(),
      role: z.nativeEnum(UserRole).optional(),
      isActive: z.boolean().optional(),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be at most 128 characters')
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

// ─── User ID Param Schema ─────────────────────────────────────────────────────
export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID format'),
  }),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────
export type ListUsersQuery = z.infer<typeof listUsersSchema>['query'];
export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
