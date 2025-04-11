import { FastifyRequest, FastifyReply } from 'fastify';

import { binding } from '@app/decorator/bidding.decorator';
import { CategoryCreateInput, CategoryListQuery, CategoryUpdateInput } from '@app/schema/category.schema';

import { CategoryService } from './category.service';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @binding
  async create(request: FastifyRequest<{ Body: CategoryCreateInput }>, reply: FastifyReply) {
    const category = await this.categoryService.create(request.body);
    return reply.success(category, 'Category created successfully');
  }

  @binding
  async update(request: FastifyRequest<{ Params: { id: string }; Body: CategoryUpdateInput }>, reply: FastifyReply) {
    const category = await this.categoryService.update(request.params.id, request.body);
    return reply.success(category, 'Category updated successfully');
  }

  @binding
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const categories = await this.categoryService.getAll();
    return reply.success(categories);
  }

  @binding
  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const category = await this.categoryService.getById(request.params.id);
    return reply.success(category);
  }

  @binding
  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.categoryService.delete(request.params.id);
    return reply.success({}, 'Category deleted successfully');
  }
}
