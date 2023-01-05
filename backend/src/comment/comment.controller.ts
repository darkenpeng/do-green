import { z } from 'zod';
import { Request, Response } from 'express';
import { BadRequestError } from '../errors/BadRequestError';
import invariant from '../utils/invariant';
import { CommentService } from './comment.service';
import { zParse } from '../utils/zParse';
import { ForbiddenError } from '../errors/ForbiddenError';

const commentService = new CommentService();

// TODO comment.zodSchema파일로 분리가 필요합니다.
const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    perPage: z.coerce.number().int().positive().default(10)
  })
});

export class CommentController {
  // async paginationComment(req:Request, res:Response) {
  //   const { postId } = req.query;
  //   // 왼쪽의 값이 falsy하면 오른쪽 값을 assign한다.
  //   req.query.page ||= '1'; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment
  //   req.query.perPage = req.query.perPage || '10';
  //   invariant(typeof req.query.page === 'string', new BadRequestError('page는 정수입니다'));
  //   invariant(typeof req.query.perPage === 'string', new BadRequestError('perPage는 정수여야 합니다'));
  //   const page = parseInt(req.query.page, 10);
  //   const perPage = parseInt(req.query.perPage, 10);

  //   invariant(typeof postId === 'string', new BadRequestError('해당하는 post가 존재하지 않습니다.'));
  //   const pagingComments = await commentService.paginationPost(postId, page, perPage);
  //   res.status(200).json(pagingComments);
  // }

  async findPaginatedCommentsAtPost(req: Request, res: Response) {
    const { id } = req.params;
    const { query: { page, perPage } } = await zParse(paginationSchema, req);

    const allComment = await commentService.findPaginatedCommentAtPost(id, page, perPage);
    res.status(200).json(allComment);
  }

  async createComment(req: Request, res: Response) {
    invariant(req.context.currentUser !== undefined, new ForbiddenError('로그인해야 이용할 수 있는 서비스입니다.'));
    const currentAuthId = req.context.currentUser.authId;
    const { comment, postId } = req.body;
    await commentService.createComment(comment, postId, currentAuthId);
    res.status(201).end();
  }

  async updateComment(req: Request, res: Response) {
    invariant(req.context.currentUser !== undefined, new ForbiddenError('로그인해야 이용할 수 있는 서비스입니다.'));
    const currentAuthId = req.context.currentUser.authId;
    const commentId = req.params.id;
    const { comment } = req.body;

    await commentService.updateComment(comment, commentId, currentAuthId);
    res.status(200).end();
  }

  async deleteComment(req: Request, res: Response) {
    invariant(req.context.currentUser !== undefined, new ForbiddenError('로그인해야 이용할 수 있는 서비스입니다.'));
    const currentAuthId = req.context.currentUser.authId;
    const commentId = req.params.id;
    await commentService.deleteComment(commentId, currentAuthId);
    res.status(204).end();
  }
}
