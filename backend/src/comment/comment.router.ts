import { Router } from 'express';
import { CommentController } from './commentController';
import { loginRequired } from '../middleware/loginRequired';
import { nextError } from '../utils/nextError';

const commentController = new CommentController();
const commentRouter = Router();

commentRouter.get('/:id', nextError(commentController.findPaginatedCommentsAtPost));
// commentRouter.get('/me', nextError(commentController.findMyComment));

commentRouter.post('/', loginRequired, nextError(commentController.createComment));
commentRouter.patch('/:id', loginRequired, nextError(commentController.updateComment));
commentRouter.delete('/:id', loginRequired, nextError(commentController.deleteComment));
export { commentRouter };
