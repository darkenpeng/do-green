import { model, Types } from 'mongoose';
import { CommentSchema } from './commentSchema';
import { PostSchema } from '../post/postSchema';
import invariant from '../invariant';
import { NotFoundError } from '../errors/NotFoundError';

const CommentModel = model<CommentT>('comments', CommentSchema);
const PostModel = model<PostT>('posts', PostSchema);

export class CommentRepository implements ICommentRepository {
  async paginationComment(postId: string, page: number, perPage: number) {
    // eslint-disable-next-line max-len
    const post = await PostModel.findById(postId, undefined, {
      populate: {
        path: 'comments',
        options: {
          skip: (page - 1) * perPage,
          limit: perPage
        }
      }
    });

    invariant(post !== null, new NotFoundError('해당하는 포스트가 존재하지 않습니다.'));

    const total = await CommentModel.count({ post: postId });
    const totalPage = Math.ceil(total / perPage);

    return {
      page, perPage, result: post.comments, totalPage
    };
  }

  async deleteComment(commentId: string) {
    await CommentModel.findByIdAndDelete(commentId);
  }

  async updateComment(commentId: string, toUpdate: updateCommentDto) {
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
