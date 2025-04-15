import { PrismaClient, Prisma } from '@prisma/client';

import { PostUpdateInput, PostResponse, PostListResponse, PostSearchQueryInput } from '@app/schema/post.schema';
import { AppError } from '@app/utils/errors';

import { mapPostToResponse } from './post.mapper';

export class PostService {
  constructor(private readonly prisma: PrismaClient) {}

  private includePostRelations = {
    author: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
    },
    categories: {
      include: {
        category: true,
      },
    },
    images: true,
    _count: {
      select: {
        comments: true,
      },
    },
  };

  // async create(userId: string, data: PostCreateInput): Promise<PostResponse> {
  //   const { title, content, status, visibility, categoryIds = [] } = data;
  //   // Kiểm tra category có tồn tại
  //   if (categoryIds.length > 0) {
  //     const existingCategories = await this.prisma.category.findMany({
  //       where: { id: { in: categoryIds } },
  //       select: { id: true },
  //     });

  //     const existingIds = existingCategories.map((c) => c.id);
  //     const missingIds = categoryIds.filter((id) => !existingIds.includes(id));

  //     if (missingIds.length > 0) {
  //       throw new AppError(`Category not found: ${missingIds.join(', ')}`, 400);
  //     }
  //   }

  //   // Tạo bài viết
  //   const newPost = await this.prisma.post.create({
  //     data: {
  //       title,
  //       content,
  //       status,
  //       visibility,
  //       authorId: userId,
  //       categories: {
  //         create: categoryIds.map((categoryId) => ({
  //           category: { connect: { id: categoryId } },
  //         })),
  //       },
  //     },
  //     include: this.includePostRelations,
  //   });

  //   return mapPostToResponse(newPost);
  // }

  async createDraft(userId: string) {
    return await this.prisma.post.create({
      data: {
        title: '',
        content: '',
        status: 'DRAFT',
        authorId: userId,
      },
      include: this.includePostRelations,
    });
  }

  // async update(userId: string, postId: string, data: PostUpdateInput): Promise<PostResponse> {
  //   const { title, content, status, visibility, categoryIds } = data;
  //   const existingPost = await this.prisma.post.findUnique({ where: { id: postId } });
  //   if (!existingPost) throw new AppError('Post not found', 404);
  //   if (existingPost.authorId !== userId) throw new AppError('You do not have permission to update this post', 403);

  //   if (categoryIds) {
  //     const existingCategories = await this.prisma.category.findMany({
  //       where: { id: { in: categoryIds } },
  //       select: { id: true },
  //     });

  //     const existingIds = existingCategories.map((c) => c.id);
  //     const missingIds = categoryIds.filter((id) => !existingIds.includes(id));

  //     if (missingIds.length > 0) {
  //       throw new AppError(`Category not found: ${missingIds.join(', ')}`, 400);
  //     }

  //     // Cập nhật lại các mối liên kết category
  //     await this.prisma.postCategory.deleteMany({ where: { postId } });

  //     if (categoryIds.length > 0) {
  //       await this.prisma.postCategory.createMany({
  //         data: categoryIds.map((categoryId) => ({
  //           postId,
  //           categoryId,
  //         })),
  //       });
  //     }
  //   }

  //   // Cập nhật nội dung post
  //   await this.prisma.post.update({
  //     where: { id: postId },
  //     data: {
  //       title,
  //       content,
  //       status,
  //       visibility,
  //     },
  //   });

  //   // Lấy lại post mới nhất
  //   const post = await this.prisma.post.findUniqueOrThrow({
  //     where: { id: postId },
  //     include: this.includePostRelations,
  //   });

  //   return mapPostToResponse(post);
  // }
  async update(userId: string, postId: string, data: PostUpdateInput): Promise<PostResponse> {
    const { title, content, status, visibility, categoryIds } = data;

    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError('Post not found', 404);
    if (post.authorId !== userId) throw new AppError('You do not have permission to update this post', 403);

    // 1. Nếu xuất bản, validate dữ liệu bắt buộc
    if (status === 'PUBLISHED') {
      if (!title?.trim() || !content?.trim()) {
        throw new AppError('Title and content are required to publish', 400);
      }
    }

    // 2. Xử lý category nếu có truyền vào
    if (categoryIds) {
      const existingCategories = await this.prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true },
      });

      const existingIds = existingCategories.map((c) => c.id);
      const missingIds = categoryIds.filter((id) => !existingIds.includes(id));

      if (missingIds.length > 0) {
        throw new AppError(`Category not found: ${missingIds.join(', ')}`, 400);
      }

      // Cập nhật lại quan hệ category
      await this.prisma.postCategory.deleteMany({ where: { postId } });
      await this.prisma.postCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          postId,
          categoryId,
        })),
      });
    }

    // 3. Cập nhật dữ liệu chính
    await this.prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        visibility,
        status,
      },
    });

    const updatedPost = await this.prisma.post.findUniqueOrThrow({
      where: { id: postId },
      include: this.includePostRelations,
    });

    return mapPostToResponse(updatedPost);
  }

  async getById(postId: string): Promise<PostResponse> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: this.includePostRelations,
    });

    if (!post) throw new AppError('Post not found', 404);
    return mapPostToResponse(post);
  }

  async getAll(params: PostSearchQueryInput = {}, currentUserId?: string): Promise<PostListResponse> {
    const { query, categoryId, authorId, createdFrom, createdTo, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    // Xây dựng điều kiện tìm kiếm cơ bản
    const whereClause: Prisma.PostWhereInput = {};

    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      whereClause.categories = {
        some: { categoryId },
      };
    }

    if (authorId) {
      whereClause.authorId = authorId;
    }

    if (createdFrom || createdTo) {
      whereClause.createdAt = {};
      if (createdFrom) whereClause.createdAt.gte = new Date(createdFrom);
      if (createdTo) whereClause.createdAt.lte = new Date(createdTo);
    }

    // Điều kiện phân quyền
    const publicVisibleCondition: Prisma.PostWhereInput = {
      visibility: 'PUBLIC',
      status: { not: 'DRAFT' }, // Ẩn bài viết DRAFT đối với người không phải tác giả
    };

    const authorOwnPostsCondition: Prisma.PostWhereInput = currentUserId ? { authorId: currentUserId } : {};

    const conditions: Prisma.PostWhereInput[] = [];

    // Điều kiện tìm kiếm
    if (whereClause.OR) conditions.push({ OR: whereClause.OR });
    if (whereClause.categories) conditions.push({ categories: whereClause.categories });
    if (whereClause.status) conditions.push({ status: whereClause.status });
    if (whereClause.authorId) conditions.push({ authorId: whereClause.authorId });
    if (whereClause.createdAt) conditions.push({ createdAt: whereClause.createdAt });

    // Điều kiện phân quyền
    if (currentUserId) {
      conditions.push({
        OR: [publicVisibleCondition, authorOwnPostsCondition],
      });
    } else {
      conditions.push(publicVisibleCondition);
    }

    const finalWhereClause: Prisma.PostWhereInput = conditions.length > 1 ? { AND: conditions } : conditions[0] || {};

    // Truy vấn DB
    const [posts, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        where: finalWhereClause,
        skip,
        take: limit,
        include: this.includePostRelations,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where: finalWhereClause }),
    ]);

    return {
      posts: posts.map((post) => mapPostToResponse(post)),
      meta: {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        perPage: limit,
      },
    };
  }

  async getUserPosts(userId: string, page = 1, perPage = 10): Promise<PostListResponse> {
    const skip = (page - 1) * perPage;

    const [posts, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        where: { authorId: userId },
        skip,
        take: perPage,
        include: this.includePostRelations,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where: { authorId: userId } }),
    ]);

    return {
      posts: posts.map((p) => mapPostToResponse(p)),
      meta: {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / perPage),
        perPage,
      },
    };
  }

  async delete(userId: string, postId: string): Promise<{ success: true }> {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError('Post not found', 404);
    if (post.authorId !== userId) throw new AppError('You do not have permission to delete this post', 403);

    await this.prisma.$transaction([
      this.prisma.postCategory.deleteMany({ where: { postId } }),
      this.prisma.post.delete({ where: { id: postId } }),
    ]);
    return { success: true };
  }
}
