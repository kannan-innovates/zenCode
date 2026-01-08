import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import logger from '@shared/utils/logger.util';

export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadToS3 = async (
  file: Express.Multer.File,
  folder: string = 'avatars',
): Promise<string> => {
  const key = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read', // So avatar is accessible via URL
  });

  try {
    await s3Client.send(command);
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    logger.info('File uploaded to S3', { key, url });
    return url;
  } catch (error) {
    logger.error('S3 upload failed', { error });
    throw new Error('Failed to upload avatar');
  }
};

export const deleteFromS3 = async (url: string): Promise<void> => {
  try {
    const key = url.split(
      `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`,
    )[1];
    if (!key) return;

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    await s3Client.send(command);
    logger.info('File deleted from S3', { key });
  } catch (error) {
    logger.error('S3 delete failed', { error });
  }
};