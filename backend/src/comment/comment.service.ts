import { PostRepository } from '../post/post.repository';
import { CommentRepository } from './comment.repository';
import { NotFoundError } from '../errors/NotFoundError';
import invariant from '../utils/invariant';
import { ForbiddenError } from '../errors/ForbiddenError';

const commentRepository = new CommentRepository();
const postRepository = new PostRepository();

export class CommentService {
  async findPaginatedCommentAtPost(postId: string, page: number, perPage: number) {
    const pagingComment = await commentRepository.paginationComment(postId, page, perPage);
    return pagingComment;
  }

  async deleteComment(commentId: string, currentAuthId: string) {
    // FIXME 양쪽이 강하게 결합되어 있어 분리가 반드시 필요합니다
    invariant(
      await commentRepository.isWrittenByCurrentUser(commentId, currentAuthId),
      new ForbiddenError('작성자가 아니므로 권한이 존재하지 않습니다.')
    );
    await postRepository.deletePostCommentId(commentId, currentAuthId);
    await commentRepository.deleteComment(commentId, currentAuthId);
  }

  async updateComment(comment: CommentT['comment'], commentId: string, currentAuthId: string) {
    // 코멘트 수정
    invariant(
      await commentRepository.isWrittenByCurrentUser(commentId, currentAuthId),
      new ForbiddenError('작성자가 아니므로 권한이 존재하지 않습니다.')
    );
    const toUpdate = {
      ...(comment && { comment })
    };
    await commentRepository.updateComment(commentId, toUpdate, currentAuthId);
  }

  async createComment(comment: CommentT['comment'], postId: string, authId:string) {
    invariant(
      await postRepository.isExistPost(postId),
      new NotFoundError(`${postId} Post가 없습니다.`)
    );

    // 찾은 username은 comment에 받아온 내용과 함께 생성
    const newComment = await commentRepository
      .createComment(postId, authId, comment);

    await postRepository.addcommentList(postId, newComment.id);
  }
}
