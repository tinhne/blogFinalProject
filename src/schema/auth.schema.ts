import { z } from 'zod';
import fromZodSchema from 'zod-to-json-schema';

import { dateOfBirthSchema, genderEnum, passwordSchema } from './shared';

// Schema đăng ký người dùng
export const userRegisterSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: passwordSchema,
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  dateOfBirth: dateOfBirthSchema,
  gender: genderEnum.default('UNSPECIFIED'),
  address: z.string().optional(),
});

// Schema đăng nhập
export const userLoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

// Schema yêu cầu đặt lại mật khẩu
export const resetPasswordRequestSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

// Schema đặt lại mật khẩu
export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Reset token is required' }),
  password: passwordSchema,
});

// Schema phản hồi người dùng
export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().optional(),
  dateOfBirth: dateOfBirthSchema,
  gender: z.enum(['MALE', 'FEMALE', 'UNSPECIFIED']),
  address: z.string().optional(),
  isVerified: z.boolean(),
  isAdmin: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schema phản hồi đăng nhập
export const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: userResponseSchema,
});

export const messageResponseSchema = z.object({
  message: z.string(),
});

// Schema refresh token
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, { message: 'Refresh token is required' }),
});

// Xuất JSON Schema cho Swagger (swagger UI)
export const userLoginJsonSchema = fromZodSchema(userLoginSchema, { target: 'openApi3' });
export const resetPasswordRequestJsonSchema = fromZodSchema(resetPasswordRequestSchema, { target: 'openApi3' });
export const resetPasswordJsonSchema = fromZodSchema(resetPasswordSchema, { target: 'openApi3' });
export const refreshTokenJsonSchema = fromZodSchema(refreshTokenSchema, { target: 'openApi3' });
export const userRegisterJsonSchema = fromZodSchema(userRegisterSchema, { target: 'openApi3' });
export const userResponseJsonSchema = fromZodSchema(userResponseSchema, { target: 'openApi3' });
export const messageResponseJsonSchema = fromZodSchema(messageResponseSchema, { target: 'openApi3' });
export const loginResponseJsonSchema = fromZodSchema(loginResponseSchema, { target: 'openApi3' });

// Xuất TypeScript types
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;
