import { Router } from 'express';
import { loginRequired } from '../middleware/loginRequired';
import { nextError } from '../utils/nextError';
import { SubscribeController } from './subscribe.controller';

const subscribeRouter = Router();

subscribeRouter.use(loginRequired);

const subscribeController = new SubscribeController();

subscribeRouter.get('/', nextError(subscribeController.findMySubscription));
subscribeRouter.post('/:categoryId', nextError(subscribeController.subscribeCategory));
subscribeRouter.delete('/:categoryId', nextError(subscribeController.unsubscribeCategory));

export { subscribeRouter };
