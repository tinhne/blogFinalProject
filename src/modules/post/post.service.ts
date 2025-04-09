import { PrismaClient } from '@prisma/client';

export class PostService {
  constructor(private readonly prisma: PrismaClient) {}
  async createPost(data, userId: number, images: string[]) {
    return await this.prisma.post.create({
      data: { ...data, userId, images },
    });
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
