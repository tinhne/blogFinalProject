import { PrismaClient } from '@prisma/client';

import { CommentCreateInput, CommentUpdateInput } from '@app/schema/comment.schema';
import { AppError } from '@app/utils/errors';

export class CommentService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(userId: string, data: CommentCreateInput) {
    const { content, postId } = data;

    // Kiểm tra bài viết tồn tại
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Tạo comment mới
    const comment = await this.prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
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

    return this.formatCommentResponse(comment);
  }

  async update(userId: string, commentId: string, data: CommentUpdateInput) {
    const { content } = data;

    // Kiểm tra comment tồn tại và quyền sở hữu
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.authorId !== userId) {
      throw new AppError('You do not have permission to update this comment', 403);
    }

    // Cập nhật comment
    const updatedComment = await this.prisma.comment.update({
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

    return this.formatCommentResponse(updatedComment);
  }

  async getByPostId(postId: string, page = 1, perPage = 10) {
    const skip = (page - 1) * perPage;

    // Kiểm tra bài viết tồn tại
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const [comments, totalCount] = await Promise.all([
      this.prisma.comment.findMany({
        where: { postId },
        skip,
        take: perPage,
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
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.comment.count({
        where: { postId },
      }),
    ]);

    const formattedComments = comments.map((comment) => this.formatCommentResponse(comment));

    return {
      comments: formattedComments,
      meta: {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / perPage),
        perPage,
      },
    };
  }

  async getUserComments(userId: string, page = 1, perPage = 10) {
    const skip = (page - 1) * perPage;

    const [comments, totalCount] = await Promise.all([
      this.prisma.comment.findMany({
        where: { authorId: userId },
        skip,
        take: perPage,
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
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.comment.count({
        where: { authorId: userId },
      }),
    ]);

    const formattedComments = comments.map((comment) => this.formatCommentResponse(comment));

    return {
      comments: formattedComments,
      meta: {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / perPage),
        perPage,
      },
    };
  }

  async delete(userId: string, commentId: string) {
    // Kiểm tra comment tồn tại và quyền sở hữu
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.authorId !== userId) {
      throw new AppError('You do not have permission to delete this comment', 403);
    }

    // Xóa comment
    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return { success: true };
  }

  private formatCommentResponse(comment) {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      author: {
        id: comment.author.id,
        firstName: comment.author.firstName,
        lastName: comment.author.lastName,
        avatarUrl: comment.author.avatarUrl,
      },
      post: {
        id: comment.post.id,
        title: comment.post.title,
      },
    };
  }
}
