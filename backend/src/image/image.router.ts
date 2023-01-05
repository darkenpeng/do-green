import { Router } from 'express';
import upload from './upload.middleware';
import { ImageController } from './image.controller';
import { nextError } from '../utils/nextError';
import { loginRequired } from '../middleware/loginRequired';

const imageController = new ImageController();
const imageRouter = Router();

imageRouter.use(loginRequired);

imageRouter.post('/', upload.single('image'), nextError(imageController.post));

export { imageRouter };
