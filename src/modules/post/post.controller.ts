import { FastifyRequest, FastifyReply } from 'fastify';

import { binding } from '@app/decorator/bidding.decorator';
import { PostSearchQueryInput, PostUpdateInput } from '@app/schema/post.schema';

import { PostService } from './post.service';

export class PostController {
  constructor(private readonly postService: PostService) {}

  // @binding
  // async create(request: FastifyRequest<{ Body: PostCreateInput }>, reply: FastifyReply) {
  //   const post = await this.postService.create(request.user.id, request.body);
  //   return reply.success(post, 'Post created successfully');
  // }

  @binding
  async createDraft(request: FastifyRequest, reply: FastifyReply) {
    const draft = await this.postService.createDraft(request.user.id);
    return reply.success(draft, 'Draft post created successfully');
  }

  @binding
  async update(request: FastifyRequest<{ Params: { id: string }; Body: PostUpdateInput }>, reply: FastifyReply) {
    const post = await this.postService.update(request.user.id, request.params.id, request.body);
    return reply.success(post, 'Post updated successfully');
  }

  @binding
  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const post = await this.postService.getById(request.params.id);
    return reply.success(post);
  }

  @binding
  async getAll(request: FastifyRequest<{ Querystring: PostSearchQueryInput }>, reply: FastifyReply) {
    const currentUserId = request.user?.id;
    const posts = await this.postService.getAll(request.query, currentUserId);
    return reply.success(posts);
  }

  @binding
  async getUserPosts(
    request: FastifyRequest<{ Querystring: { page?: string; perPage?: string } }>,
    reply: FastifyReply
  ) {
    const page = parseInt(request.query.page || '1', 10);
    const perPage = parseInt(request.query.perPage || '10', 10);

    const posts = await this.postService.getUserPosts(request.user.id, page, perPage);
    return reply.success(posts);
  }

  @binding
  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.postService.delete(request.user.id, request.params.id);
    return reply.success({}, 'Post deleted successfully');
  }
}
