import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';

import { userProfileSelect } from '@app/constant/prisma.select';
import { UserChangePasswordInput, UserUpdateInput } from '@app/schema/user.schema';

export class UserService {
  constructor(private prisma: PrismaClient) {}

  // Cập nhật user
  async update(userId: string, data: UserUpdateInput) {
    const { firstName, lastName, avatarUrl, dateOfBirth, gender, address } = data;
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(avatarUrl && { avatarUrl }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(gender && { gender }),
        ...(address && { address }),
      },
      select: userProfileSelect,
    });

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Xoá user
  async delete(userId: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  // Lấy thông tin 1 user kèm bài viết & bình luận
  async show(userId: string) {
    const user = this.prisma.user.findUnique({
      where: { id: userId },
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
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            status: true,
            visibility: true,
            createdAt: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            postId: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async changePassword(userId: string, data: UserChangePasswordInput) {
    const { currentPassword, newPassword } = data;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
      },
    });

    return { success: true };
  }
}
