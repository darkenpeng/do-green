import { Router } from 'express';
import { loginRequired } from '../middleware/loginRequired';
import { UserController } from './user.controller';
import { activeRequired } from '../middleware/activeRequired';
import { nextError } from '../utils/nextError';

const userController = new UserController();
const userRouter = Router();

userRouter.use(loginRequired, activeRequired);

userRouter.get('/me', nextError(userController.findMyUserInfo));
userRouter.patch('/me/withdraw', nextError(userController.withdrawMyself)); // 탈퇴
userRouter.patch('/me', nextError(userController.updateMyself)); // 수정

export { userRouter };
