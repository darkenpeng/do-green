import {
  Request, Response
} from 'express';
import { BadRequestError } from '../errors/BadRequestError';
import invariant from '../utils/invariant';

export class ImageController {
  async post(req: Request, res: Response) {
    invariant(
      req.file !== null && req.file !== undefined,
      new BadRequestError('이미지 파일이 필요합니다.')
    );

    res.status(200).send(req.file.location);
  }
}
