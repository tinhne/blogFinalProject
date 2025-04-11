import { MultipartFile } from '@fastify/multipart';
import { PrismaClient, MediaType } from '@prisma/client';

import { AppError } from '@app/utils/errors';
import { handleImageUpload } from '@app/utils/file';

export class MediaService {
  constructor(private readonly prisma: PrismaClient) {}

  async uploadImage(
    file: MultipartFile,
    folder: 'post' | 'avatar',
    uploadedBy: string, // ID của user
    postId?: string,
    alt?: string
  ): Promise<{ url: string; thumbnail?: string; id: string }> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    if (post.authorId !== uploadedBy) {
      throw new AppError('You are not authorized to upload image for this post', 403);
    }

    const { url, thumbnail } = await handleImageUpload(file, folder);

    const media = await this.prisma.media.create({
      data: {
        url,
        thumbnail,
        type: folder === 'avatar' ? MediaType.AVATAR : MediaType.POST,
        uploadedBy,
        postId,
        alt,
      },
    });

    return {
      url,
      thumbnail,
      id: media.id,
    };
  }

  async deleteImage(imageId: string, userId: string): Promise<boolean> {
    const image = await this.prisma.media.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new AppError('Image not found', 404);
    }

    if (image.uploadedBy !== userId) {
      throw new AppError('You are not authorized to delete this image', 403);
    }

    await this.prisma.media.delete({
      where: { id: imageId },
    });

    return true;
  }
}
