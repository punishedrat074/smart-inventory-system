import { prisma } from '../../config/database';
import { type Prisma } from '../../generated/prisma';
import { AppError } from '../../utils/AppError.util';
import { hashPassword } from '../../utils/password.util';
import {
  type CreateUserInput,
  type ListUsersQuery,
  type UpdateUserInput,
} from './users.schema';

// Standard user select object excluding sensitive fields (passwordHash)
const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * List users with pagination, search, and filtering options.
 */
export const listUsers = async (query: ListUsersQuery) => {
  const { page, limit, search, role, isActive } = query;
  const skip = (page - 1) * limit;

  // Build dynamic where clause
  const where: Prisma.UserWhereInput = {};

  if (role !== undefined) {
    where.role = role;
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: userSelect,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    users,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

/**
 * Get single user by ID.
 */
export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

/**
 * Create a new user (Admin only).
 */
export const createUser = async (input: CreateUserInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
    },
    select: userSelect,
  });

  return user;
};

/**
 * Update an existing user (Admin only).
 * Prevents an admin from deactivating or demoting their own account.
 */
export const updateUser = async (
  targetUserId: string,
  input: UpdateUserInput,
  currentAdminId: string,
) => {
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new AppError('User not found', 404);
  }

  // Prevent self-demotion or self-deactivation by the current admin
  if (targetUserId === currentAdminId) {
    if (input.isActive === false) {
      throw new AppError('You cannot deactivate your own account', 400);
    }
    if (input.role && input.role !== targetUser.role) {
      throw new AppError('You cannot change your own admin role', 400);
    }
  }

  const updateData: Prisma.UserUpdateInput = {};

  if (input.firstName !== undefined) updateData.firstName = input.firstName;
  if (input.lastName !== undefined) updateData.lastName = input.lastName;
  if (input.role !== undefined) updateData.role = input.role;
  if (input.isActive !== undefined) updateData.isActive = input.isActive;

  if (input.password) {
    updateData.passwordHash = await hashPassword(input.password);
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: updateData,
    select: userSelect,
  });

  // If user was deactivated or password updated, revoke their refresh tokens
  if (input.isActive === false || input.password) {
    await prisma.refreshToken.deleteMany({
      where: { userId: targetUserId },
    });
  }

  return updatedUser;
};

/**
 * Deactivate a user (Admin only).
 * Sets isActive to false and revokes all active refresh tokens.
 */
export const deactivateUser = async (
  targetUserId: string,
  currentAdminId: string,
) => {
  if (targetUserId === currentAdminId) {
    throw new AppError('You cannot deactivate your own account', 400);
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new AppError('User not found', 404);
  }

  const deactivatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { isActive: false },
    select: userSelect,
  });

  // Invalidate all active sessions for deactivated user
  await prisma.refreshToken.deleteMany({
    where: { userId: targetUserId },
  });

  return deactivatedUser;
};
