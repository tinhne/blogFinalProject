import { FastifyRequest, FastifyReply } from 'fastify';

import { binding } from '@app/decorator/bidding.decorator';
import { CommentCreateInput, CommentUpdateInput } from '@app/schema/comment.schema';

import { CommentService } from './comment.service';

export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @binding
  async create(request: FastifyRequest<{ Body: CommentCreateInput }>, reply: FastifyReply) {
    try {
      const comment = await this.commentService.create(request.user.id, request.body);
      return reply.success(comment, 'Comment created successfully');
    } catch (error) {
      return reply.error(error.message, error.statusCode || 500);
    }
  }

  @binding
  async update(request: FastifyRequest<{ Params: { id: string }; Body: CommentUpdateInput }>, reply: FastifyReply) {
    try {
      const comment = await this.commentService.update(request.user.id, request.params.id, request.body);
      return reply.success(comment, 'Comment updated successfully');
    } catch (error) {
      return reply.error(error.message, error.statusCode || 500);
    }
  }

  @binding
  async getByPostId(
    request: FastifyRequest<{ Params: { postId: string }; Querystring: { page?: string; perPage?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const page = request.query.page ? parseInt(request.query.page, 10) : 1;
      const perPage = request.query.perPage ? parseInt(request.query.perPage, 10) : 10;

      const comments = await this.commentService.getByPostId(request.params.postId, page, perPage);
      return reply.success(comments);
    } catch (error) {
      return reply.error(error.message, error.statusCode || 500);
    }
  }

  @binding
  async getUserComments(
    request: FastifyRequest<{ Querystring: { page?: string; perPage?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const page = request.query.page ? parseInt(request.query.page, 10) : 1;
      const perPage = request.query.perPage ? parseInt(request.query.perPage, 10) : 10;

      const comments = await this.commentService.getUserComments(request.user.id, page, perPage);
      return reply.success(comments);
    } catch (error) {
      return reply.error(error.message, error.statusCode || 500);
    }
  }

  @binding
  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await this.commentService.delete(request.user.id, request.params.id);
      return reply.success({}, 'Comment deleted successfully');
    } catch (error) {
      return reply.error(error.message, error.statusCode || 500);
    }
  }
}
