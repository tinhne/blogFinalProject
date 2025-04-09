import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';

import { AppError } from '@app/utils/errors';

import { ResetPasswordInput, UserLoginInput, UserRegisterInput } from '../../schema';
import { sendPasswordResetEmail, sendVerificationEmail } from '../../utils/email';
import { TokenUser, generateSecureToken, generateTokens } from '../../utils/token';

export class AuthService {
  constructor(private fastify: FastifyInstance) {}

  async registerUser(data: UserRegisterInput) {
    const { email, password, firstName, lastName, ...otherData } = data;

    // Check if user exists
    const existingUser = await this.fastify.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Email already exists', 409);
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
        dateOfBirth: otherData.dateOfBirth ? new Date(otherData.dateOfBirth) : undefined,
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
      throw new AppError('Invalid verification token', 401);
    }

    if (verificationRecord.expiresAt < new Date()) {
      await this.fastify.prisma.emailVerification.delete({ where: { id: verificationRecord.id } });
      throw new AppError('Verification token has expired', 401);
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
      throw new AppError('user not found', 404);
    }

    // Check if email is verified
    if (!user.isVerified) {
      throw new AppError('Please verify your email before logging in', 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Password incorrect', 401);
    }

    const tokenUser: TokenUser = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const { accessToken, refreshToken } = generateTokens(this.fastify, tokenUser);

    await this.fastify.prisma.refreshToken.deleteMany({
      where: {
        userId: user.id,
        userAgent: userAgent || 'unknown',
        ipAddress,
      },
    });
    // Store refresh token
    await this.fastify.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 30 days
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
      throw new AppError('User not found', 404);
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
      throw new AppError('User not found', 404);
    }

    if (user.resetTokenExpiresAt < new Date()) {
      throw new AppError('Reset token has expired', 401);
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
    const storedToken = await this.fastify.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!storedToken) {
      throw new AppError('Invalid refresh token', 401);
    }
    if (storedToken.revoked) {
      throw new AppError('Refresh token has been revoked', 401);
    }

    if (storedToken.expiresAt < new Date()) {
      throw new AppError('Refresh token has expired', 401);
    }

    // Verify the token
    const decoded = this.fastify.jwt.verify<TokenUser & { type: string }>(token);

    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid token type', 401);
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
      throw new AppError('User not found', 404);
    }

    // Generate new access token
    const accessToken = generateTokens(this.fastify, user).accessToken;

    return { accessToken };
  }
  async resendVerification(email: string) {
    const user = await this.fastify.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.isVerified) {
      throw new AppError('User is already verified', 400);
    }

    // Xóa token cũ nếu tồn tại
    await this.fastify.prisma.emailVerification.deleteMany({
      where: { userId: user.id },
    });

    const newToken = generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 ngày

    await this.fastify.prisma.emailVerification.create({
      data: {
        userId: user.id,
        token: newToken,
        expiresAt,
      },
    });

    await sendVerificationEmail(user.email, user.firstName, newToken);
  }
}
