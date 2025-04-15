import { PrismaClient } from '@prisma/client';

import { CommentUpdateInput } from '@app/schema';
import { CategoryCreateInput, CategoryUpdateInput } from '@app/schema/category.schema';
import { AppError } from '@app/utils/errors';

export class AdminService {
  constructor(private readonly prisma: PrismaClient) {}
  private readonly categoryWithPostCountInclude = {
    _count: {
      select: {
        posts: true,
      },
    },
  };

  async index() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        dateOfBirth: true,
        gender: true,
        address: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return users;
  }

  async dashboard() {
    const totalUsers = await this.prisma.user.count();
    const totalPosts = await this.prisma.post.count();
    const totalComments = await this.prisma.comment.count();

    return {
      totalUsers,
      totalPosts,
      totalComments,
    };
  }
  async createCategory(data: CategoryCreateInput) {
    const { name, description } = data;

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
      include: this.categoryWithPostCountInclude,
    });

    return category;
  }

  async updateCategory(categoryId: string, data: CategoryUpdateInput) {
    const { name, description } = data;

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
      include: this.categoryWithPostCountInclude,
    });

    return updatedCategory;
  }
  async deleteCategory(categoryId: string) {
    // Kiểm tra category tồn tại
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: this.categoryWithPostCountInclude,
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
  }

  async updateComment(commentId: string, data: CommentUpdateInput) {
    const { content } = data;
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    // Cập nhật comment
    const newComment = await this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return newComment;
  }

  async delete(commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    // Xóa comment
    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return { success: true };
  }
}
