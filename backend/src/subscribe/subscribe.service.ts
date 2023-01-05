import { model, Types } from 'mongoose';
import { CategoryRepository } from '../category/category.repository';
import { CategoryService } from '../category/category.serivce';
import { BadRequestError } from '../errors/BadRequestError';
import invariant from '../utils/invariant';
import { UserService } from '../user/user.service';
import { SubscribeSchema } from './subscribe.schema';

const SubscribeModel = model<SubscribeT>('subscribes', SubscribeSchema);
const categorySerivce = new CategoryService();

export class SubscribeService {
  async findSubscriptionByAuthId(authId: string) {
    const subscribe = await SubscribeModel.findOne({ authId });
    invariant(subscribe !== null, new BadRequestError('구독정보가 없습니다.')); // not found
    const result = await categorySerivce
      .findCategoryByIds(subscribe.categoryId.map(id => id.toString()));
    return result;
  }

  async subscribeCategory(currentAuthId: string, categoryId: string) {
    let subscribe = await SubscribeModel.findOne({ authId: currentAuthId });
    if (subscribe == null) {
      subscribe = new SubscribeModel({ authId: currentAuthId, categoryId: [] });
    }

    invariant(
      subscribe.categoryId.some(id => id.toString() === categoryId) === false,
      new BadRequestError('이미 구독한 카테고리입니다.')
    );

    invariant(
      await categorySerivce.isCategoryExists(categoryId),
      new BadRequestError('존재하지 않는 카테고리입니다.')
    );

    subscribe.categoryId.push(categoryId);
    await subscribe.save();
  }

  async unsubscribeCategory(currentAuthId: string, categoryId: string) {
    let subscribe = await SubscribeModel.findOne({ authId: currentAuthId });
    if (subscribe == null) {
      subscribe = new SubscribeModel({ authId: currentAuthId, categoryId: [] });
    }
    invariant(
      subscribe.categoryId.some(id => id.toString() === categoryId) === true,
      new BadRequestError('구독하지 않은 카테고리입니다.')
    );

    subscribe.categoryId = subscribe.categoryId.filter(id => id.toString() !== categoryId);
    await subscribe.save();
  }
};
