import { FastifyRequest, FastifyReply } from 'fastify';

import { binding } from '@app/decorator/bidding.decorator';

import {
  RefreshTokenInput,
  ResetPasswordInput,
  ResetPasswordRequestInput,
  UserLoginInput,
  UserRegisterInput,
} from '../../schema';

import { AuthService } from './auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @binding
  async register(request: FastifyRequest<{ Body: UserRegisterInput }>, reply: FastifyReply) {
    const result = await this.authService.registerUser(request.body);
    return reply.success(
      { verificationToken: result.verificationToken },
      'User registered successfully. Please check your email to verify your account.',
      201
    );
  }

  @binding
  async verifyEmail(request: FastifyRequest<{ Querystring: { token: string } }>, reply: FastifyReply) {
    const { token } = request.query;
    await this.authService.verifyEmail(token);
    return reply.success({}, 'Email verified successfully', 200);
  }

  @binding
  async login(request: FastifyRequest<{ Body: UserLoginInput }>) {
    const result = await this.authService.loginUser(request.body, request.headers['user-agent'], request.ip);
    return result;
  }
  @binding
  async forgotPassword(request: FastifyRequest<{ Body: ResetPasswordRequestInput }>, reply: FastifyReply) {
    const result = await this.authService.requestPasswordReset(request.body.email);
    return { resetToken: result.resetToken };
  }
  @binding
  async resetPassword(request: FastifyRequest<{ Body: ResetPasswordInput }>, reply: FastifyReply) {
    await this.authService.resetPassword(request.body);
    return reply.success('Password reset successfully');
  }

  @binding
  async refreshToken(request: FastifyRequest<{ Body: RefreshTokenInput }>) {
    const result = await this.authService.refreshToken(request.body.refreshToken);
    return result;
  }

  @binding
  async resendVerificationEmail(request: FastifyRequest<{ Body: { email: string } }>, reply: FastifyReply) {
    const { email } = request.body;
    await this.authService.resendVerification(email);
    return reply.success('Verification email resent successfully');
  }
}
