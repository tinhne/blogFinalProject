import { PrismaClient } from '@prisma/client';

import { AppError } from '@app/utils/errors';

export class CategoryService {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll() {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories.map((category) => category);
  }
}
