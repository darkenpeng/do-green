import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth/auth.service';
import { ForbiddenError } from '../errors/ForbiddenError';
import invariant from '../utils/invariant';

const authService = new AuthService();

const loginRequired = (req: Request, res: Response, next: NextFunction) => {
  const userToken = req.headers['authorization']?.split(' ')[1];

  invariant(
    userToken !== undefined && userToken !== '',
    new ForbiddenError('로그인해야 이용할 수 있는 서비스입니다.')
  );

  const currentUser = authService.verifyCurrentUser(userToken);

  req.context = { currentUser };

  next();
};

export { loginRequired };
