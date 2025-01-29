import { z } from 'zod';

// 基础用户 Schema (来自数据库表)
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Invalid email format'),
  username: z.string().min(2, 'Username must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  salt: z.string(),
  role: z.enum(['admin', 'user']),
  createdAt: z.date(),
  updatedAt: z.date(),
  refreshToken: z.string(),
  lastSignedIn: z.date(),
});

// 创建用户请求的验证 Schema
export const createUserSchema = userSchema.pick({
  email: true,
  password: true,
  username: true,
  salt: true,
  role: true,
});

// 更新用户的验证 Schema
export const updateUserSchema = userSchema.partial();

// 用于返回给客户端的安全用户数据 Schema（排除敏感字段）
export const safeUserSchema = userSchema.omit({
  password: true,
  salt: true,
  refreshToken: true,
  lastSignedIn: true,
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type User = z.infer<typeof userSchema>;
export type SafeUser = z.infer<typeof safeUserSchema>;
