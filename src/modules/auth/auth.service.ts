import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';

import { ResetPasswordInput, UserLoginInput, UserRegisterInput } from '../../schema';
import { sendPasswordResetEmail, sendVerificationEmail } from '../../utils/email';
import { TokenError, TokenUser, generateSecureToken, generateTokens } from '../../utils/token';

export class AuthService {
  constructor(private fastify: FastifyInstance) {}

  async registerUser(data: UserRegisterInput) {
    const { email, password, firstName, lastName, ...otherData } = data;

    // Check if user exists
    const existingUser = await this.fastify.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.fastify.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        ...otherData,
        avatarUrl: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
      },
    });

    // Generate verification token
    const verificationToken = generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    // Store verification token
    await this.fastify.prisma.emailVerification.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt,
      },
    });

    // Send verification email
    await sendVerificationEmail(user.email, user.firstName, verificationToken);

    return { user, verificationToken };
  }

  async verifyEmail(token: string) {
    const verificationRecord = await this.fastify.prisma.emailVerification.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationRecord) {
      throw new Error('Invalid verification token');
    }

    if (verificationRecord.expiresAt < new Date()) {
      await this.fastify.prisma.emailVerification.delete({ where: { id: verificationRecord.id } });
      throw new Error('Verification token has expired');
    }

    // Mark user as verified
    await this.fastify.prisma.user.update({
      where: { id: verificationRecord.userId },
      data: { isVerified: true },
    });

    // Delete token
    await this.fastify.prisma.emailVerification.delete({ where: { id: verificationRecord.id } });

    return { success: true };
  }

  async loginUser(credentials: UserLoginInput, userAgent: string, ipAddress: string) {
    const { email, password } = credentials;

    const user = await this.fastify.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email');
    }

    // Check if email is verified
    if (!user.isVerified) {
      throw new Error('Please verify your email before logging in');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Password incorrect');
    }

    const tokenUser: TokenUser = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const { accessToken, refreshToken } = generateTokens(this.fastify, tokenUser);

    // Store refresh token
    await this.fastify.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        userAgent: userAgent || 'unknown',
        ipAddress,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
      },
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.fastify.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate reset token
    const resetToken = generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    // Store reset token
    await this.fastify.prisma.user.update({
      where: { email },
      data: {
        resetToken: resetToken,
        resetTokenExpiresAt: expiresAt,
      },
    });

    await sendPasswordResetEmail(user.email, user.firstName, resetToken);
    return { success: true };
  }

  async resetPassword(data: ResetPasswordInput) {
    const { token, password } = data;

    const user = await this.fastify.prisma.user.findUnique({ where: { resetToken: token } });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.resetTokenExpiresAt < new Date()) {
      throw new Error('Reset token has expired');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.fastify.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    return { success: true };
  }

  async refreshToken(token: string) {
    try {
      const storedToken = await this.fastify.prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!storedToken) {
        throw new TokenError('Invalid refresh token');
      }

      // Verify the token
      const decoded = this.fastify.jwt.verify<TokenUser & { type: string }>(token);

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

      // Generate new access token
      const accessToken = generateTokens(this.fastify, user).accessToken;

      return { accessToken };
    } catch (error) {
      if (error instanceof TokenError) {
        throw error;
      } else if (error.name === 'JsonWebTokenError') {
        throw new TokenError('Invalid or malformed token');
      } else if (error.name === 'TokenExpiredError') {
        throw new TokenError('Token has expired');
      }
      throw new TokenError('Unable to refresh access token');
    }
  }
}
