import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

import { MultipartFile } from '@fastify/multipart';

const MAX_SIZE_MB = 10;
const VALID_MIMES = ['image/png', 'image/jpeg', 'image/jpg'];
const UPLOAD_DIR = path.join(__dirname, '../../../uploads');

export async function saveFile(file: MultipartFile, postId?: string): Promise<string> {
  if (!VALID_MIMES.includes(file.mimetype)) {
    throw new Error('Invalid file type');
  }

  if (file.file.truncated) {
    throw new Error('File too large');
  }

  const ext = file.filename.split('.').pop();
  const fileName = `${randomUUID()}.${ext}`;
  const postDir = path.join(UPLOAD_DIR, postId || 'unknown');

  fs.mkdirSync(postDir, { recursive: true });

  const filePath = path.join(postDir, fileName);
  const writeStream = fs.createWriteStream(filePath);
  await file.file.pipe(writeStream);

  return `/uploads/${postId}/${fileName}`; // URL trả về
}
