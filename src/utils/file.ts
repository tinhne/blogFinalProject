import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { MultipartFile } from '@fastify/multipart';

import { s3Client, S3_BUCKET } from '@app/config/aws';

import { AppError } from './errors';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

export async function saveBufferToLocal(buffer: Buffer, originalFileName: string, folder: string): Promise<string> {
  const ext = path.extname(originalFileName);
  const fileName = `${randomUUID()}${ext}`;
  const uploadDir = path.join(__dirname, '../../public/uploads', folder);

  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);

  return `/uploads/${folder}/${fileName}`;
}

export async function uploadFileBufferToS3(
  buffer: Buffer,
  originalFileName: string,
  mimetype: string,
  folder: string
): Promise<string> {
  const ext = path.extname(originalFileName);
  const fileName = `${folder}/${randomUUID()}${ext}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: mimetype,
      ACL: 'public-read',
    })
  );

  return `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`;
}

export async function handleImageUpload(file: MultipartFile, folder: 'avatar' | 'post'): Promise<string> {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new AppError('Chỉ chấp nhận PNG, JPG, JPEG', 400);
  }

  const buffer = await file.toBuffer();
  if (buffer.length > MAX_FILE_SIZE) {
    throw new AppError('File vượt quá kích thước cho phép (10MB)', 400);
  }

  if (process.env.NODE_ENV === 'production') {
    return await uploadFileBufferToS3(buffer, file.filename, file.mimetype, folder);
  }

  return await saveBufferToLocal(buffer, file.filename, folder);
}

export async function deleteLocalFile(fileUrl: string) {
  const localPath = path.join(__dirname, '../../public', fileUrl);
  await fs.unlink(localPath);
}

export async function deleteS3File(fileUrl: string) {
  const key = fileUrl.split('.com/')[1];
  if (!key) throw new Error('Sai đường dẫn file S3');
  await s3Client.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
}
