import { createUserSchema, userSchema } from './user';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod/dto';
// 验证 Schema
export const registerSchema = createUserSchema.pick({
  email: true,
  password: true,
  username: true,
});

export const loginSchema = z
  .object({
    identifier: z.string().min(6),
    password: z.string().min(6),
  })
  .superRefine((data, ctx) => {
    if (data.identifier.includes('@')) {
      const emailResult = z.string().email().min(10).safeParse(data.identifier);
      if (!emailResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: emailResult.error.errors[0]?.message || 'Invalid email',
          path: ['identifier'],
        });
      }
    } else {
      const usernameResult = userSchema.safeParse(data.identifier);
      if (!usernameResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            usernameResult.error.errors[0]?.message || 'Invalid Credentials',
          path: ['identifier'],
        });
      }
    }
  });

export const jwtPayloadSchema = userSchema.pick({
  id: true,
  email: true,
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
export class RegisterDto extends createZodDto(registerSchema) {}
export class LoginDto extends createZodDto(loginSchema) {}
