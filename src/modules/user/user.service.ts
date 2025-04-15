import { MultipartFile } from '@fastify/multipart';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

import { userProfileSelect } from '@app/constant/prisma.select';
import { UserChangePasswordInput, UserUpdateInput } from '@app/schema/user.schema';
import { AppError } from '@app/utils/errors';
import { handleImageUpload } from '@app/utils/file';

export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  async update(userId: string, data: UserUpdateInput) {
    try {
      const updateData: Record<string, any> = {
        ...data,
        ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
      };

      const user = await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: userProfileSelect,
      });

      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new AppError('Record not found', 404);
      }
      throw new AppError('Failed to update user', 500);
    }
  }

  // Lấy thông tin 1 user kèm bài viết & bình luận
  async show(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userProfileSelect,
    });

    if (!user) {
      throw new AppError('User not found', 404);
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
      throw new AppError('Current password is incorrect', 400);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
      },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { revoked: true },
    });

    return { success: true };
  }

  async uploadAvatar(userId: string, file: MultipartFile): Promise<string> {
    const { url } = await handleImageUpload(file, 'avatar');

    // update user trong db
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: url,
      },
    });
    return url;
  }
}
