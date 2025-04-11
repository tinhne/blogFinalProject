// modules/category/category.service.ts
import { PrismaClient } from '@prisma/client';

import { CategoryCreateInput, CategoryUpdateInput } from '@app/schema/category.schema';
import { AppError } from '@app/utils/errors';

export class CategoryService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CategoryCreateInput) {
    const { name, description } = data;

    try {
      // Kiểm tra tên category đã tồn tại chưa
      const existingCategory = await this.prisma.category.findFirst({
        where: { name },
      });

      if (existingCategory) {
        throw new AppError('Category with this name already exists', 400);
      }

      // Tạo category mới
      const category = await this.prisma.category.create({
        data: {
          name,
          description,
        },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      return category;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create category', 500);
    }
  }

  async update(categoryId: string, data: CategoryUpdateInput) {
    const { name, description } = data;

    try {
      // Kiểm tra category tồn tại
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      // Kiểm tra tên mới đã tồn tại chưa
      if (name && name !== category.name) {
        const existingCategory = await this.prisma.category.findFirst({
          where: { name },
        });

        if (existingCategory) {
          throw new AppError('Category with this name already exists', 400);
        }
      }

      // Cập nhật category
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;

      const updatedCategory = await this.prisma.category.update({
        where: { id: categoryId },
        data: updateData,
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      return updatedCategory;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update category', 500);
    }
  }

  async getAll() {
    try {
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
    } catch (error) {
      throw new AppError('Failed to get categories', 500);
    }
  }

  async getById(categoryId: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      return category;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to get category', 500);
    }
  }

  async delete(categoryId: string) {
    try {
      // Kiểm tra category tồn tại
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      // Check if category has posts
      if (category._count.posts > 0) {
        throw new AppError('Cannot delete category with associated posts', 400);
      }

      // Xóa category
      await this.prisma.category.delete({
        where: { id: categoryId },
      });

      return { success: true };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete category', 500);
    }
  }
}
