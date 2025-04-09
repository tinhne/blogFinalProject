import { S3Client } from '@aws-sdk/client-s3';

import { env } from './env';
export const S3_BUCKET = process.env.S3_BUCKET_NAME as string;

export const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
  },
});
