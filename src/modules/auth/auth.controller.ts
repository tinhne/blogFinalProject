import { FastifyRequest, FastifyReply } from 'fastify';

import { binding } from '@app/decorator/bidding.decorator';

import {
  RefreshTokenInput,
  ResetPasswordInput,
  ResetPasswordRequestInput,
  UserLoginInput,
  UserRegisterInput,
} from '../../schema';
import { TokenError } from '../../utils/token';

import { AuthService } from './auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @binding
  async register(request: FastifyRequest<{ Body: UserRegisterInput }>, reply: FastifyReply) {
    try {
      const result = await this.authService.registerUser(request.body);

      return reply.success(
        { verificationToken: result.verificationToken },
        'User registered successfully. Please check your email to verify your account.',
        201
      );
    } catch (error) {
      if (error.message === 'Email already exists') {
        return reply.conflict(error.message);
      }

      return reply.internalServerError('An error occurred while registering the user');
    }
  }

  @binding
  async verifyEmail(request: FastifyRequest<{ Querystring: { token: string } }>, reply: FastifyReply) {
    const { token } = request.query;

    try {
      await this.authService.verifyEmail(token);
      return reply.success({}, 'Email verified successfully', 200);
    } catch (error) {
      return reply.badRequest(error.message);
    }
  }

  @binding
  async login(request: FastifyRequest<{ Body: UserLoginInput }>, reply: FastifyReply) {
    try {
      const result = await this.authService.loginUser(request.body, request.headers['user-agent'], request.ip);

      return result;
    } catch (error) {
      if (error.message === 'Invalid email or password' || error.message === 'Password incorrect') {
        return reply.unauthorized(error.message);
      } else if (error.message === 'Please verify your email before logging in') {
        return reply.forbidden(error.message);
      }

      return reply.internalServerError('An error occurred while logging in');
    }
  }
  @binding
  async forgotPassword(request: FastifyRequest<{ Body: ResetPasswordRequestInput }>, reply: FastifyReply) {
    try {
      await this.authService.requestPasswordReset(request.body.email);

      return reply.success('Password reset email sent successfully');
    } catch (error) {
      request.log.error(error);

      if (error.message === 'User not found') {
        return reply.notFound(error.message);
      }

      return reply.internalServerError('An error occurred while sending the password reset email');
    }
  }
  @binding
  async resetPassword(request: FastifyRequest<{ Body: ResetPasswordInput }>, reply: FastifyReply) {
    try {
      await this.authService.resetPassword(request.body);

      return reply.success('Password reset successfully');
    } catch (error) {
      if (error.message === 'User not found') {
        return reply.notFound(error.message);
      } else if (error.message === 'Reset token has expired') {
        return reply.badRequest(error.message);
      }

      return reply.internalServerError('An error occurred while resetting the password');
    }
  }

  @binding
  async refreshToken(request: FastifyRequest<{ Body: RefreshTokenInput }>, reply: FastifyReply) {
    try {
      const result = await this.authService.refreshToken(request.body.refreshToken);
      return result;
    } catch (error) {
      if (error instanceof TokenError) {
        return reply.unauthorized(error.message);
      }

      return reply.internalServerError('An error occurred while refreshing the token');
    }
  }

  // async logout(request: FastifyRequest, reply: FastifyReply) {}
}
