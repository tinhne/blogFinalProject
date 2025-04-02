import crypto from 'crypto';

import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';

import { env } from '../../config/env';

// Lỗi tùy chỉnh
class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenError';
  }
}

interface TokenUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

export class AuthService {
  constructor(private fastify: FastifyInstance) {}

  // Generate access token
  generateAccessToken(user: TokenUser) {
    return this.fastify.jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      {
        expiresIn: env.ACCESS_TOKEN_EXPIRY, // 2 hours
      }
    );
  }

  // Generate refresh token
  generateRefreshToken(user: TokenUser) {
    return this.fastify.jwt.sign(
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
  }

  // Generate both tokens
  generateTokens(user: TokenUser) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  // Verify refresh token
  async verifyRefreshToken(refreshToken: string) {
    try {
      const decoded = this.fastify.jwt.verify<TokenUser & { type: string }>(refreshToken);

      if (decoded.type !== 'refresh') {
        throw new TokenError('Invalid token type');
      }

      const user = await this.fastify.prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          isAdmin: true,
        },
      });

      if (!user) {
        throw new TokenError('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof TokenError) {
        throw error;
      } else if (error.name === 'JsonWebTokenError') {
        throw new TokenError('Invalid or malformed token');
      } else if (error.name === 'TokenExpiredError') {
        throw new TokenError('Token has expired');
      }
      throw new TokenError('Invalid refresh token');
    }
  }

  // Refresh the access token using refresh token
  async refreshAccessToken(refreshToken: string) {
    try {
      const user = await this.verifyRefreshToken(refreshToken);
      const newAccessToken = this.generateAccessToken(user);

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new TokenError('Unable to refresh access token');
    }
  }

  // Generate a secure random token (for email verification, password reset)
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }
}
