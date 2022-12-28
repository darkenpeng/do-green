import { Router } from 'express';
import { CommentController } from './commentController';
import { loginRequired } from '../middleware/loginRequired';
import { nextError } from '../nextError';

const commentController = new CommentController();
const commentRouter = Router();

commentRouter.get('/:postId', nextError(commentController.findPaginatedCommentsAtPost));
// commentRouter.get('/me', nextError(commentController.findMyComment));

commentRouter.post('/', loginRequired, nextError(commentController.createComment));
commentRouter.patch('/:commentId', loginRequired, nextError(commentController.updateComment));
commentRouter.delete('/:commentId', loginRequired, nextError(commentController.deleteComment));
export { commentRouter };
