import { FastifyRequest, FastifyReply } from 'fastify';

import { binding } from '@app/decorator/bidding.decorator';

import { MediaService } from './media.service';

export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @binding
  async uploadImage(request: FastifyRequest, reply: FastifyReply) {
    const file = await request.file();
    const userId = request.user?.id;
    const {
      folder = 'post',
      postId,
      alt,
    } = request.query as {
      folder?: 'post' | 'avatar';
      postId?: string;
      alt?: string;
    };

    if (!userId) return reply.error('User not found', 404);
    if (!file) return reply.error('Missing image file', 400);

    // optional: nếu folder là 'post' thì yêu cầu postId
    if (folder === 'post' && !postId) return reply.error('Missing postId', 400);

    const result = await this.mediaService.uploadImage(file, folder, userId, postId, alt);
    return reply.success(result, 'Image uploaded successfully');
  }

  @binding
  async deleteImage(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const imageId = request.params.id;
    const userId = request.user?.id;

    if (!userId) return reply.error('User not found', 404);

    await this.mediaService.deleteImage(imageId, userId);
    return reply.success({}, 'Image deleted successfully');
  }
}
