import { Router } from 'express';
import { PostController } from './post.controller';
import { adminRequired } from '../middleware/adminRequired';
import { loginRequired } from '../middleware/loginRequired';
import { nextError } from '../utils/nextError';
import { loginOptional } from '../middleware/loginOptional';

const postController = new PostController();
const postRouter = Router();

// NOT LOGGED IN
postRouter.get('/admin/all', loginRequired, adminRequired, nextError(postController.findAllPost));
postRouter.get('/:id', loginOptional, nextError(postController.findOnePost));
postRouter.get('/', loginOptional, nextError(postController.paginationPost));
// ADMIN
postRouter.post('/create', loginRequired, adminRequired, nextError(postController.createPost));
postRouter.patch('/:id', loginRequired, adminRequired, nextError(postController.updatePost));
postRouter.delete('/:id', loginRequired, adminRequired, nextError(postController.deletePost));

// USER
postRouter.patch('/like/:id', loginRequired, nextError(postController.addlikeUserId));

export { postRouter };
