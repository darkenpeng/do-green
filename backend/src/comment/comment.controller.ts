import { Request, Response } from 'express';
import invariant from '../utils/invariant';
import { CommentService } from './comment.service';
import { zParse } from '../utils/zParse';
import { ForbiddenError } from '../errors/ForbiddenError';
import { paginationSchema } from './comment.zodSchema';

const commentService = new CommentService();

export class CommentController {
  // 반복되는 로직 추상화
  async loginRequiredError(req: Request){
    invariant(req.context.currentUser !== undefined, new ForbiddenError('로그인해야 이용할 수 있는 서비스입니다.'));
  }

  async findPaginatedCommentsAtPost(req: Request, res: Response) {
    const { id } = req.params;
    const { query: { page, perPage } } = await zParse(paginationSchema, req);

    const allComment = await commentService.findPaginatedCommentAtPost(id, page, perPage);
    res.status(200).json(allComment);
  }

  async createComment(req: Request, res: Response) {
    await this.loginRequiredError(req);
    const currentAuthId = req.context.currentUser.authId;
    const { comment, postId } = req.body;
    
    await commentService.createComment(comment, postId, currentAuthId);
    res.status(201).end();
  }

  async updateComment(req: Request, res: Response) {
    await this.loginRequiredError(req);
    const currentAuthId = req.context.currentUser.authId;
    const commentId = req.params.id;
    const { comment } = req.body;

    await commentService.updateComment(comment, commentId, currentAuthId);
    res.status(200).end();
  }

  async deleteComment(req: Request, res: Response) {
    await this.loginRequiredError(req);
    const currentAuthId = req.context.currentUser.authId;
    const commentId = req.params.id;

    await commentService.deleteComment(commentId, currentAuthId);
    res.status(204).end();
  }
}
