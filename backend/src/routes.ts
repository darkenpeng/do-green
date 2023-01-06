import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import { authRouter } from './auth/auth.router';
import { adminRouter } from './user/admin.router';
import { userRouter } from './user/user.router';
import { categoryRouter } from './category/category.router';
import { subscribeRouter } from './subscribe/subscribe.router';
import { postRouter } from './post/post.router';
import { commentRouter } from './comment/comment.router';
import { imageRouter } from './image/image.router';
import apiSpec from '../openapi.json' assert { type: 'json' };

const router = Router();

router.use('/admin', adminRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/category', categoryRouter);
router.use('/subscribe', subscribeRouter);
router.use('/comment', commentRouter);
router.use('/image', imageRouter);

// Dev routes
if (process.env.NODE_ENV === 'development') {
  router.use('/dev/api-docs', swaggerUi.serve);
  router.get('/dev/api-docs', swaggerUi.setup(apiSpec));
}

router.get('/', (req, res) => {
  res.send('pong!');
});

export default router;
