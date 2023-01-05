import { model, Types } from 'mongoose';
import { CommentSchema } from './comment.schema';
import { PostSchema } from '../post/post.schema';
import invariant from '../utils/invariant';
import { NotFoundError } from '../errors/NotFoundError';
import ApplicationError from '../errors/ApplicationError';
import { UserSchema } from '../user/user.schema';
import { ForbiddenError } from '../errors/ForbiddenError';

const CommentModel = model<CommentT>('comments', CommentSchema);
const PostModel = model<PostT>('posts', PostSchema);
const UserModel = model<UserT>('users', UserSchema);
export class CommentRepository implements ICommentRepository {
  async paginationComment(postId: string, page: number, perPage: number) {
    const post = await PostModel.findById(postId, undefined, {
      populate: {
        path: 'comments',
        options: {
          sort: { 'createdAt': -1 },
          skip: (page - 1) * perPage,
          limit: perPage
        }
      }
    });

    invariant(post !== null, new NotFoundError('해당하는 포스트가 존재하지 않습니다.'));
    invariant(post.comments !== undefined, new ApplicationError('해당하는 댓글이 존재하지 않습니다.', 404));

    const total = await CommentModel.count({ refPost: postId });
    const totalPage = Math.ceil(total / perPage);
    const authIdList = post.comments.map(comment => comment.authId);

    const userList = await UserModel.find({ auth: authIdList }, undefined, {
      select: 'auth username imgUrl'
    });

    const userMap = new Map<string, Pick<UserT, 'username' | 'imgUrl'> & { _id: string }>();
    userList.forEach(user => {
      const authId = String(user.auth);
      userMap.set(authId, {
        _id: String(user._id),
        username: user.username,
        imgUrl: user.imgUrl
      });
    });
    const result = post.comments.map((comment, i) => ({
      _id: comment._id,
      refPost: comment.refPost,
      userId: userMap.get(String(authIdList[i])),
      comment: comment.comment,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt
    }));

    return {
      page, perPage, result, totalPage
    };
  }

  async isWrittenByCurrentUser(commentId: string, currentAuthId: string): Promise<boolean> {
    const targetComment = await CommentModel.findById(commentId); // null

    invariant(targetComment !== null, new NotFoundError(`${commentId} 코멘트가 존재하지 않습니다.`));
    return targetComment.authId.toString() === currentAuthId;
  }

  async deleteComment(commentId: string, currentAuthId: string) {
    await CommentModel.findByIdAndDelete(commentId);
  }

  async updateComment(commentId: string, toUpdate: updateCommentDto, currentAuthId: string) {
    await CommentModel.findByIdAndUpdate(commentId, { comment: toUpdate.comment });
  }

  async createComment(postId: string, authId: string, comment: CommentT['comment']) {
    const newComment = await CommentModel.create({
      refPost: postId,
      authId,
      comment
    });
    return newComment;
  }
}
