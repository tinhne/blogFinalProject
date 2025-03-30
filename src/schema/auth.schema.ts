import { boolean, z } from 'zod';

export const loginSchema = {
  body: z.object({
    email: z.string().email('Email not valid'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
  }),
  response: {
    200: z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
      user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email('Email not valid'),
        roles: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          })
        ),
      }),
    }),
  },
};

export const registerSchema = {
  body: z.object({
    email: z.string().email('Email not valid'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  }),
  response: {
    201: z.object({
      id: z.string(),
      email: z.string(),
      name: z.string().nullable(),
      roles: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      ),
      createdAt: z.string(),
    }),
  },
};

export const refreshTokenSchema = {
  body: z.object({
    refreshToken: z.string(),
  }),
  response: {
    200: z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
    }),
  },
};

export const forgotPasswordSchema = {
  body: z.object({
    email: z.string().email('Email is not valid'),
  }),
  response: {
    200: z.object({
      message: z.string(),
    }),
  },
};

export const changePasswordSchema = {
  body: z.object({
    currentPassword: z.string().min(8, 'Password must be at least 8 characters long'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  }),
  response: {
    200: z.object({
      message: z.string(),
    }),
  },
};
