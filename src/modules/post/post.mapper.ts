import { PostResponse } from '@app/schema';

export function mapPostToResponse(post: any): PostResponse {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    status: post.status,
    visibility: post.visibility,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    author: post.author,
    categories: post.categories.map((c: any) => ({
      id: c.category.id,
      name: c.category.name,
    })),
  };
}

// Optional nếu có danh sách bài viết
export function mapPostsToResponse(posts: any[]): PostResponse[] {
  return posts.map(mapPostToResponse);
}
