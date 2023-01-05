import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { zParse } from '../utils/zParse';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema, isDuplicatedSchema } from './auth.zodSchema';

const authService = new AuthService();
const userService = new UserService();

export class AuthController {
  async register(req: Request, res: Response) {
    const { body } = await zParse(registerSchema, req);

    await userService.register(body);
    res.status(201).end();
  };

  async login(req: Request, res: Response) {
    const { body } = await zParse(loginSchema, req);
    const userToken = await authService.generateUserToken(body);
    res.status(200).json(userToken);
  };

  async isDuplicated(req: Request, res: Response) {
    const { query } = await zParse(isDuplicatedSchema, req);

    const result = { } as Partial<{ email: boolean, username: boolean }>;
    if (query.email) {
      result.email = await userService.isDuplicatedEmail(query.email);
    }
    if (query.username) {
      result.username = await userService.isDuplicatedUsername(query.username);
    }
    res.status(200).json(result);
  }
};
