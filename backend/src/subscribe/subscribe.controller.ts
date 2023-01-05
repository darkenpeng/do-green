import { Request, Response } from 'express';
import { ForbiddenError } from '../errors/ForbiddenError';
import invariant from '../utils/invariant';
import { SubscribeService } from './subscribe.service';

const subscribeService = new SubscribeService();

export class SubscribeController {
  async findMySubscription(req: Request, res: Response) {
    invariant(req.context.currentUser !== undefined, new ForbiddenError('로그인해야 이용할 수 있는 서비스입니다.'));
    const currentAuthId = req.context.currentUser.authId;
    const subscribeInfo = await subscribeService.findSubscriptionByAuthId(currentAuthId);
    res.status(200).json(subscribeInfo);
  }

  async subscribeCategory(req: Request, res: Response) {
    invariant(req.context.currentUser !== undefined, new ForbiddenError('로그인해야 이용할 수 있는 서비스입니다.'));
    const currentAuthId = req.context.currentUser.authId;
    const { categoryId } = req.params;
    await subscribeService.subscribeCategory(currentAuthId, categoryId);
    res.status(201).end();
  }

  async unsubscribeCategory(req: Request, res: Response) {
    invariant(req.context.currentUser !== undefined, new ForbiddenError('로그인해야 이용할 수 있는 서비스입니다.'));
    const currentAuthId = req.context.currentUser.authId;
    const { categoryId } = req.params;
    await subscribeService.unsubscribeCategory(currentAuthId, categoryId);
    res.status(204).end();
  }
};
