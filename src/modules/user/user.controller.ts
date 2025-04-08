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
}
