import { MultipartFile } from '@fastify/multipart';
import { PrismaClient } from '@prisma/client';

import { CreatePostInput, UpdatePostInput } from '@app/schema/post.schema';

export class PostService {
  constructor(private readonly prisma: PrismaClient) {}
  async createPost(userId: string, data: CreatePostInput, files: MultipartFile[]) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: userId,
        categories: {
          create: data.categoryIds?.map((id) => ({ categoryId: id })) || [],
        },
        images: {
          create: files.map((file) => ({
            url: `/uploads/${file.filename}`,
          })),
        },
      },
    });
  }

  async updatePost(postId: string, userId: string, data: UpdatePostInput, files: MultipartFile[]) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.authorId !== userId) throw new Error('Unauthorized or post not found');

    // Xóa ảnh cũ nếu có yêu cầu
    if (data.deletedImageIds?.length) {
      await this.prisma.postImage.deleteMany({
        where: {
          id: { in: data.deletedImageIds },
          postId,
        },
      });
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        title: data.title,
        content: data.content,
        updatedAt: new Date(),
        images: {
          create: files.map((file) => ({
            url: `/uploads/${file.filename}`,
          })),
        },
      },
    });
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.authorId !== userId) throw new Error('Unauthorized');

    return this.prisma.post.delete({ where: { id: postId } });
  }

  async index(query) {
    const { page = 1, limit = 10, q = '' } = query;
    const skip = (page - 1) * limit;
    return await this.prisma.post.findMany({
      where: {
        OR: [{ title: { contains: q, mode: 'insensitive' } }, { content: { contains: q, mode: 'insensitive' } }],
      },
      skip: Number(skip),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });
  }
}
