import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

import { MultipartFile } from '@fastify/multipart';
import sharp from 'sharp';

import { env } from '@app/config/env';

import { AppError } from './errors';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

function generateFileName(originalFileName: string, folder: string) {
  const ext = path.extname(originalFileName);
  return `${folder}/${randomUUID()}${ext}`;
}

export async function saveBufferToLocal(buffer: Buffer, originalFileName: string, folder: string): Promise<string> {
  const fileName = generateFileName(originalFileName, folder);
  const uploadDir = path.join(__dirname, '../../public', fileName);
  await fs.mkdir(path.dirname(uploadDir), { recursive: true });
  await fs.writeFile(uploadDir, buffer);
  // return `/public/${fileName}`;
  const host = env.BASE_URL || 'http://localhost:3000';

  return `${host}/public/${fileName}`;
}

export async function deleteLocalFile(relativePath: string) {
  const fullPath = path.join(__dirname, '../../', relativePath);
  try {
    await fs.unlink(fullPath);
  } catch (e) {
    console.warn('File not found:', relativePath);
  }
}

export async function handleImageUpload(
  file: MultipartFile,
  folder: 'avatar' | 'post'
): Promise<{ url: string; thumbnail?: string }> {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new AppError('Chỉ chấp nhận PNG, JPG, JPEG', 400);
  }

  const buffer = await file.toBuffer();
  if (buffer.length > MAX_FILE_SIZE) {
    throw new AppError('File vượt quá kích thước cho phép (10MB)', 400);
  }

  const url = await saveBufferToLocal(buffer, file.filename, folder);

  // Chỉ tạo thumbnail nếu folder là "post"
  if (folder === 'post') {
    const thumbBuffer = await sharp(buffer).resize(300).jpeg({ quality: 70 }).toBuffer();
    const thumbnail = await saveBufferToLocal(thumbBuffer, `thumb-${file.filename}`, folder);

    return { url, thumbnail };
  }

  return { url };
}
