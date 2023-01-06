import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import type { AwsCredentialIdentity } from '@aws-sdk/types';
import { Request } from 'express';
import dotenv from 'dotenv';
import invariant from '../utils/invariant';
import logger from '../logger';

dotenv.config();

type FileNameCallback = (error: Error | null, filename: string) => void;

invariant(process.env.AWS_ACCESS_KEY, 'AWS_ACCESS_KEY 환경변수가 필요합니다.');
invariant(process.env.AWS_SECRET_KEY, 'AWS_SECRET_KEY 환경변수가 필요합니다.');
invariant(process.env.BUCKET_NAME, 'BUCKET_NAME 환경변수가 필요합니다.');

const credentials: AwsCredentialIdentity & { accessKeyId: string } = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
};

const s3Client = new S3Client({
  credentials,
  region: 'ap-northeast-2'
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(req: Request, file: Express.Multer.File, cb: FileNameCallback) {
      cb(null, `${Date.now()}-${encodeURI(file.originalname)}`);
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});
export default upload;
