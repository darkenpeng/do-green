import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors/ForbiddenError';
import invariant from '../utils/invariant';

const adminRequired = (req: Request, res: Response, next: NextFunction) => {
  invariant(req.context.currentUser !== undefined, new ForbiddenError('로그인해야 이용할 수 있는 서비스입니다.'));
  if (req.context.currentUser.role !== 'ADMIN') {
    throw new ForbiddenError('관리자만 이용할 수 있습니다.');
  }

  next();
};

export { adminRequired };
