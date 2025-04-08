import { FastifyRequest, FastifyReply } from 'fastify';

import { binding } from '@app/decorator/bidding.decorator';

import { UserUpdateInput, UserChangePasswordInput } from '../../schema';

import { UserService } from './user.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  @binding
  async show(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;
      const profile = await this.userService.show(userId);
      console.log('profile', profile);
      return reply.success(profile);
      //   return reply.send(profile);
    } catch (error) {
      request.log.error(error);

      if (error.message === 'User not found') {
        return reply.notFound(error.message);
      }

      return reply.internalServerError('An error occurred while retrieving user profile');
    }
  }

  @binding
  async update(request: FastifyRequest<{ Body: UserUpdateInput }>, reply: FastifyReply) {
    try {
      const userId = request.user.id;
      const updatedProfile = await this.userService.update(userId, request.body);
      return reply.success(updatedProfile, 'Profile updated successfully');
    } catch (error) {
      request.log.error(error);
      return reply.internalServerError('An error occurred while updating user profile');
    }
  }

  @binding
  async changePassword(request: FastifyRequest<{ Body: UserChangePasswordInput }>, reply: FastifyReply) {
    try {
      const userId = request.user.id;
      await this.userService.changePassword(userId, request.body);
      return reply.success({}, 'Password changed successfully');
    } catch (error) {
      request.log.error(error);

      if (error.message === 'Current password is incorrect') {
        return reply.badRequest(error.message);
      } else if (error.message === 'User not found') {
        return reply.notFound(error.message);
      }

      return reply.internalServerError('An error occurred while changing password');
    }
  }
}
