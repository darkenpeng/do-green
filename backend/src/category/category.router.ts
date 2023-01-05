import { Router } from 'express';
import { CategoryController } from './categoryController';
import { adminRequired } from '../middleware/adminRequired';
import { loginRequired } from '../middleware/loginRequired';
import { nextError } from '../utils/nextError';

const categoryController = new CategoryController();
const categoryRouter = Router();

categoryRouter.get('/:id', nextError(categoryController.findOneCategory)); // 카테고리 하나조회
categoryRouter.get('/', nextError(categoryController.findAllCategory)); // 카테고리 전체조회

categoryRouter.post('/create', loginRequired, adminRequired, nextError(categoryController.createCategory)); // 카테고리 생성
categoryRouter.patch('/:id', loginRequired, adminRequired, nextError(categoryController.updateCategory)); // 카테고리 수정
categoryRouter.delete('/:id', loginRequired, adminRequired, nextError(categoryController.deleteCategory)); // 카테고리 삭제

export { categoryRouter };
