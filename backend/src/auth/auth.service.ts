// 외부 라이브러리
import { model } from 'mongoose';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
// 내부 공통 유틸리티
import invariant from '../utils/invariant';
import { ForbiddenError } from '../errors/ForbiddenError';
import { InternalServerError } from '../errors/InternalServerError';
import type { CurrentUser } from '../index';
// 모듈 내부 private
import { AuthSchema } from './auth.schema';
import { BadRequestError } from '../errors/BadRequestError';

const AuthModel = model<AuthT>('auths', AuthSchema);

export class AuthService implements IAuthService {
  async createAuth(newAuth: AuthT) {
    const hash = await argon2.hash(newAuth.password);

    return new AuthModel({
      email: newAuth.email,
      password: hash,
      role: newAuth.role
    });
  }

  async existUserByEmail(email: AuthT['email']) {
    const result = await AuthModel.exists({ email });
    return result !== null;
  }

  async generateUserToken(authDTO: Pick<AuthT, 'email' | 'password'>) {
    // email로 auth 정보 찾아온다
    const auth = await AuthModel.findOne({ email: authDTO.email });
    invariant(auth !== null, new BadRequestError(`${authDTO.email}은 가입 내역이 없습니다.`)); // 타입 가드

    // auth의 password와 db의 password를 argon2로 verify한다
    const isVerified = await argon2.verify(
      auth.password, // DB에 해시된 Password
      authDTO.password // 사용자가 준 plain text
    );

    invariant(isVerified, new BadRequestError('패스워드가 일치하지 않습니다.'));
    invariant(process.env.JWT_SECRET, new InternalServerError('JWT_SECRET 환경 변수가 필요합니다.'));

    return jwt.sign(
      {
        authId: auth._id.toString(),
        email: auth.email,
        role: auth.role
      },
      process.env.JWT_SECRET
    );
  };

  // password가 correct한지 authService에서 확인하는 함수
  async isPasswordCorrect(oldPassword: AuthT['password'], email: AuthT['email']) {
    // 비밀번호를  수정
    const oldAuth = await AuthModel.findOne({ email });
    invariant(oldAuth !== null, new BadRequestError(`${email}은 가입 내역이 없습니다.`)); // 타입 가드

    // auth의 password와 db의 password를 argon2로 verify한다
    return argon2.verify(
      oldAuth.password,
      oldPassword
    );
  };

  async updatePassword(
    oldPassword: AuthT['password'],
    newAuth: {
      email: AuthT['email'],
      newPassword?: AuthT['password']
    }
  ) {
    const isPasswordCorrect = await this.isPasswordCorrect(oldPassword, newAuth.email);
    invariant(isPasswordCorrect, new BadRequestError('입력하신 비밀번호가 틀립니다'));

    if (!newAuth.newPassword) {
      return;
    }

    const newHash = await argon2.hash(newAuth.newPassword);
    await AuthModel.updateOne({ email: newAuth.email }, { password: newHash });
  }

  async findAll() {
    const authIds = AuthModel.find({ role: 'USER' }).select('_id');
    invariant(authIds !== null, '유저가 존재하지 않습니다.'); // type Guards
    return authIds;
  }

  verifyCurrentUser(userToken: string): CurrentUser {
    invariant(
      process.env.JWT_SECRET !== undefined,
      new InternalServerError('JWT_SECRET 환경 변수가 필요합니다.')
    );

    const currentUser = jwt.verify(userToken, process.env.JWT_SECRET);

    invariant(
      typeof currentUser === 'object',
      new ForbiddenError('JWT payload는 객체여야 합니다.')
    );

    return currentUser as CurrentUser;
  }
}
