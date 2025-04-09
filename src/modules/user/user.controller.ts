import { FastifyRequest, FastifyReply } from 'fastify';

import { binding } from '@app/decorator/bidding.decorator';

import { UserUpdateInput, UserChangePasswordInput } from '../../schema';

import { UserService } from './user.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  @binding
  async show(request: FastifyRequest, reply: FastifyReply) {
    const profile = await this.userService.show(request.user.id);
    return reply.success(profile);
  }

  @binding
  async update(request: FastifyRequest<{ Body: UserUpdateInput }>, reply: FastifyReply) {
    const updatedProfile = await this.userService.update(request.user.id, request.body);
    return reply.success(updatedProfile, 'Profile updated successfully');
  }

  @binding
  async changePassword(request: FastifyRequest<{ Body: UserChangePasswordInput }>, reply: FastifyReply) {
    await this.userService.changePassword(request.user.id, request.body);
    return reply.success({}, 'Password changed successfully');
  }

  @binding
  async uploadAvatar(request: FastifyRequest, reply: FastifyReply) {
    const file = await request.file();
    const userId = request.user?.id;

    if (!userId) {
      return reply.error('User not found', 404);
    }

    if (!file) {
      return reply.error('Missing avatar file', 400);
    }

    const avatarUrl = await this.userService.uploadAvatar(userId, file);
    if (!avatarUrl) {
      return reply.error('"url" is required!', 500);
    }
    return reply.success({ url: avatarUrl }, 'Avatar uploaded successfully');
  }
}
