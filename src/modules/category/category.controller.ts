import { FastifyRequest, FastifyReply } from 'fastify';

import { binding } from '@app/decorator/bidding.decorator';

import { CategoryService } from './category.service';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @binding
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const categories = await this.categoryService.getAll();
    return reply.success(categories);
  }
}
