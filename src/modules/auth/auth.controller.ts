import bcrypt from 'bcrypt';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import { UserRegisterInput } from '../../schema';
import { sendVerificationEmail } from '../../utils/email';

import { AuthService } from './auth.service';

export class AuthController {
  private AuthService: AuthService;

  constructor(private fastify: FastifyInstance) {
    this.AuthService = new AuthService(fastify);

    // Remove direct Prisma instantiation from here
    // Ensure the plugin is registered before this point
    this.register = this.register.bind(this);
  }

  async register(request: FastifyRequest<{ Body: UserRegisterInput }>, reply: FastifyReply) {
    const { email, password, firstName, lastName, dateOfBirth, gender, address } = request.body;

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
          dateOfBirth,
          gender,
          address,
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
}
