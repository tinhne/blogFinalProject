import { FastifyRequest, FastifyReply } from 'fastify';

import { binding } from '@app/decorator/bidding.decorator';

import { CommentCreateInput, CommentUpdateInput, PaginationQuery, paginationQuerySchema } from '../../schema';

import { CommentService } from './comment.service';

export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @binding
  async create(request: FastifyRequest<{ Body: CommentCreateInput }>, reply: FastifyReply) {
    const comment = await this.commentService.create(request.user.id, request.body);
    return reply.success(comment, 'Comment created successfully');
  }

  @binding
  async update(request: FastifyRequest<{ Params: { id: string }; Body: CommentUpdateInput }>, reply: FastifyReply) {
    const comment = await this.commentService.update(request.user.id, request.params.id, request.body);
    return reply.success(comment, 'Comment updated successfully');
  }

  @binding
  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.commentService.delete(request.user.id, request.params.id);
    return reply.success({}, 'Comment deleted successfully');
  }

  @binding
  async getByPostId(
    request: FastifyRequest<{ Params: { postId: string }; Querystring: PaginationQuery }>,
    reply: FastifyReply
  ) {
    const { page, perPage } = paginationQuerySchema.parse(request.query);
    const comments = await this.commentService.getByPostId(request.params.postId, page, perPage);
    return reply.success(comments);
  }

  @binding
  async getUserComments(request: FastifyRequest<{ Querystring: PaginationQuery }>, reply: FastifyReply) {
    const { page, perPage } = paginationQuerySchema.parse(request.query);
    const comments = await this.commentService.getUserComments(request.user.id, page, perPage);
    return reply.success(comments);
  }
}
