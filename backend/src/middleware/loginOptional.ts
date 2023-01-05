import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/ForbiddenError';
import invariant from '../utils/invariant';
import { loginRequired } from './loginRequired';

const loginOptional = (req: Request, res: Response, next: NextFunction) => {
  const userToken = req.headers['authorization']?.split(' ')[1];

  if (userToken === undefined || userToken === '') {
    return next();
  }

  return loginRequired(req, res, next);
};

export { loginOptional };
