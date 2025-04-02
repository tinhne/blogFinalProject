import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 3000,

  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@database:5432/namedatabase',

  JWT_SECRET: process.env.JWT_SECRET || 'supersecret',
  POSTGRES_USER: process.env.POSTGRES_USER || 'user',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'password',
  POSTGRES_DB: process.env.POSTGRES_DB || 'namedatabase',

  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 100,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || '2h',
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || '7d',

  SMTP_HOST: process.env.SMTP_HOST || 'smtp.example.com',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || 'levantrungtinh123@gmail.com',
  SMTP_PASS: process.env.SMTP_PASS || 'shibashiba',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  EMAIL_FROM: process.env.EMAIL_FROM || 'levantrungtinh123@gmail.com',
};
