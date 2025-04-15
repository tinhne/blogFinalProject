import { FastifyReply, FastifyRequest } from 'fastify';

import { binding } from '@app/decorator/bidding.decorator';
import { CommentUpdateInput } from '@app/schema';
import { CategoryCreateInput, CategoryUpdateInput } from '@app/schema/category.schema';

import { AdminService } from './admin.service';

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @binding
  async index(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.adminService.index();
    return reply.send(users);
  }

  @binding
  async dashboard(request: FastifyRequest, reply: FastifyReply) {
    const dashboardData = await this.adminService.dashboard();
    return reply.send(dashboardData);
  }

  @binding
  async createCategory(request: FastifyRequest<{ Body: CategoryCreateInput }>, reply: FastifyReply) {
    const category = await this.adminService.createCategory(request.body);
    return reply.success(category, 'Category created successfully');
  }

  @binding
  async updateCategory(
    request: FastifyRequest<{ Params: { id: string }; Body: CategoryUpdateInput }>,
    reply: FastifyReply
  ) {
    const category = await this.adminService.updateCategory(request.params.id, request.body);
    return reply.success(category, 'Category updated successfully');
  }

  @binding
  async deleteCategory(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    console.log('>> Delete category id:', request.params.id);
    await this.adminService.deleteCategory(request.params.id);
    return reply.success({}, 'Category deleted successfully');
  }

  @binding
  async update(request: FastifyRequest<{ Params: { id: string }; Body: CommentUpdateInput }>, reply: FastifyReply) {
    const comment = await this.adminService.updateComment(request.params.id, request.body);
    return reply.success(comment, 'Comment updated successfully');
  }

  @binding
  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.adminService.delete(request.params.id);
    return reply.success({}, 'Comment deleted successfully');
  }
}
