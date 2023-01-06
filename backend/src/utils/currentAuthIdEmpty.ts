import { ForbiddenError } from '../errors/ForbiddenError';
import invariant from './invariant';

export const loginRequiredError (req: Request) {
    invariant(req.context.currentUser !== undefined, new ForbiddenError('로그인해야 이용할 수 있는 서비스입니다.'));
  }
