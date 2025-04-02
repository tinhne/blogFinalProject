import { z } from 'zod';
import fromZodSchema from 'zod-to-json-schema';

// Schema đăng ký người dùng
export const userRegisterSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(16, { message: 'Password must not exceed 16 characters' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  dateOfBirth: z.string().datetime().optional(), // Dùng string thay vì date để tránh lỗi khi gửi JSON
  gender: z.enum(['MALE', 'FEMALE', 'UNSPECIFIED']).default('UNSPECIFIED'),
  address: z.string().optional(),
});

// Schema đăng nhập
export const userLoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

// Schema xác minh email
export const verifyEmailSchema = z.object({
  token: z.string().min(1, { message: 'Verification token is required' }),
});

// Schema yêu cầu đặt lại mật khẩu
export const resetPasswordRequestSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

// Schema đặt lại mật khẩu
export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Reset token is required' }),
  password: userRegisterSchema.shape.password, //  Dùng lại schema password để tránh lặp code
});

// Schema phản hồi người dùng
export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().optional(),
  dateOfBirth: z.string().optional(), // Chuyển về string
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

// Xuất JSON Schema cho Swagger (nếu cần)
export const userLoginJsonSchema = fromZodSchema(userLoginSchema, { target: 'openApi3' });
export const verifyEmailJsonSchema = fromZodSchema(verifyEmailSchema, { target: 'openApi3' });
export const resetPasswordRequestJsonSchema = fromZodSchema(resetPasswordRequestSchema, { target: 'openApi3' });
export const resetPasswordJsonSchema = fromZodSchema(resetPasswordSchema, { target: 'openApi3' });
export const refreshTokenJsonSchema = fromZodSchema(refreshTokenSchema, { target: 'openApi3' });
export const userRegisterJsonSchema = fromZodSchema(userRegisterSchema, { target: 'openApi3' });
export const userResponseJsonSchema = fromZodSchema(userResponseSchema, { target: 'openApi3' });
export const messageResponseJsonSchema = fromZodSchema(messageResponseSchema, { target: 'openApi3' });

// Xuất TypeScript types
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;
