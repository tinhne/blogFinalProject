import crypto from 'crypto';

import { FastifyInstance } from 'fastify';

import { env } from '@app/config/env';

// Custom error
export class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenError';
  }
}

export interface TokenUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

export const generateAccessToken = (fastify: FastifyInstance, user: TokenUser) => {
  return fastify.jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRY, // 2 hours
    }
  );
};

export const generateRefreshToken = (fastify: FastifyInstance, user: TokenUser) => {
  return fastify.jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      type: 'refresh',
    },
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRY, // 7 days
    }
  );
};

export const generateTokens = (fastify: FastifyInstance, user: TokenUser) => {
  const accessToken = generateAccessToken(fastify, user);
  const refreshToken = generateRefreshToken(fastify, user);

  return {
    accessToken,
    refreshToken,
  };
};

// Generate a secure random token (for email verification, password reset)
export const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};
