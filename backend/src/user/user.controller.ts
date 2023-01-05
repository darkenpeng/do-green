import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { BadRequestError } from '../errors/BadRequestError';
import { ForbiddenError } from '../errors/ForbiddenError';
import invariant from '../utils/invariant';
import { zParse } from '../utils/zParse';
import { UserService } from './user.service';
import { updateSchema } from './user.zodSchema';

const userService = new UserService();
const authService = new AuthService();

// user가 자기 정보를 조회함
export class UserController {
  async findMyUserInfo(req: Request, res: Response) {
    invariant(req.context.currentUser !== undefined, new ForbiddenError('로그인해야 이용할 수 있는 서비스입니다.'));
    const { email } = req.context.currentUser;
    const userInfo = await userService.findUserByEmail(email);
    res.status(200).json(userInfo);
  }

  async withdrawMyself(req: Request, res: Response) {
    invariant(req.context.currentUser !== undefined, new ForbiddenError('로그인해야 이용할 수 있는 서비스입니다.'));
    const { email } = req.context.currentUser;
    const { currentPassword } = req.body;
    await userService.withdraw(email, currentPassword);
    res.status(200).end();
  }

  async updateMyself(req: Request, res: Response) {
    invariant(req.context.currentUser !== undefined, new ForbiddenError('로그인해야 이용할 수 있는 서비스입니다.'));
    const { email } = req.context.currentUser;
    const {
      body: { oldPassword, newPassword, ...userInfo }
    } = await zParse(updateSchema, req);

    invariant(oldPassword !== undefined, new BadRequestError('비밀번호가 필요합니다.'));

    const isPasswordCorrect = await authService.isPasswordCorrect(oldPassword, email);
    invariant(isPasswordCorrect, new BadRequestError('입력하신 비밀번호가 틀립니다'));

    await authService.updatePassword(oldPassword, {
      email,
      newPassword // 새 비밀번호
    });

    await userService.updateUser(email, userInfo);

    res.status(200).end();
  };
}
