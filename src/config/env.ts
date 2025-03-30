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
};
