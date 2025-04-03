import bcrypt from 'bcrypt';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import { UserLoginInput, UserRegisterInput } from '../../schema';
import { sendVerificationEmail } from '../../utils/email';

import { AuthService } from './auth.service';

export class AuthController {
  private AuthService: AuthService;

  constructor(private fastify: FastifyInstance) {
    this.AuthService = new AuthService(fastify);

    // Remove direct Prisma instantiation from here
    // Ensure the plugin is registered before this point
    this.register = this.register.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
    this.login = this.login.bind(this);
  }

  async register(request: FastifyRequest<{ Body: UserRegisterInput }>, reply: FastifyReply) {
    const { email, password, firstName, lastName, ...data } = request.body;

    if (!this.fastify.prisma) {
      throw new Error('Prisma is not initialized. Ensure DatabasePlugin is registered before this controller.');
    }

    try {
      // Check user
      const existingUser = await this.fastify.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Email already exists',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.fastify.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          ...data,
          avatarUrl: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
        },
      });

      // Generate verification token
      const verificationToken = this.AuthService.generateSecureToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

      // Lưu verification token
      await this.fastify.prisma.emailVerification.create({
        data: {
          userId: user.id,
          token: verificationToken,
          expiresAt,
        },
      });

      // Send email verify
      await sendVerificationEmail(user.email, user.firstName, verificationToken);

      return reply.status(201).send({
        verificationToken,
        message: 'User registered successfully. Please check your email to verify your account.',
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An error occurred while registering the user',
      });
    }
  }

  async verifyEmail(request: FastifyRequest<{ Querystring: { token: string } }>, reply: FastifyReply) {
    const { token } = request.query;
    console.log('[DEBUG] Received token:', token);

    try {
      const verificationRecord = await this.fastify.prisma.emailVerification.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!verificationRecord) {
        console.log('[DEBUG] Token not found or expired.');
        return reply.status(400).send({ message: 'Invalid or expired verification token' });
      }

      if (verificationRecord.expiresAt < new Date()) {
        console.log('[DEBUG] Token expired.');
        await this.fastify.prisma.emailVerification.delete({ where: { id: verificationRecord.id } });
        return reply.status(400).send({ message: 'Verification token has expired' });
      }

      console.log('[DEBUG] Marking user as verified.');
      await this.fastify.prisma.user.update({
        where: { id: verificationRecord.userId },
        data: { isVerified: true },
      });

      console.log('[DEBUG] Deleting token record.');
      await this.fastify.prisma.emailVerification.delete({ where: { id: verificationRecord.id } });

      return reply.status(200).send({ message: 'Email verified successfully' });
    } catch (error) {
      console.error('[ERROR]', error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async login(request: FastifyRequest<{ Body: UserLoginInput }>, reply: FastifyReply) {
    const { email, password } = request.body;
    try {
      const user = await this.fastify.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
      }

      // Kiểm tra xem người dùng đã xác thực email chưa
      if (!user.isVerified) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Please verify your email before logging in',
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'password incorrect',
        });
      }

      const { accessToken, refreshToken } = this.AuthService.generateTokens({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      });

      await this.fastify.prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
          userAgent: request.headers['user-agent'] || 'unknown',
          ipAddress: request.ip,
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
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An error occurred while logging in',
      });
    }
  }
}
