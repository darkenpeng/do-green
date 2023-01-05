import { Router } from 'express';
import { nextError } from '../utils/nextError';
import { adminRequired } from '../middleware/adminRequired';
import { loginRequired } from '../middleware/loginRequired';
import { AdminController } from './admin.controller';

const adminRouter = Router();
const adminController = new AdminController();

adminRouter.use(loginRequired);
adminRouter.use(adminRequired);

adminRouter.patch('/ban', nextError(adminController.banUsers));
adminRouter.patch('/cancel', nextError(adminController.cancelBanUsers));
adminRouter.get('/inactive', nextError(adminController.getInactiveUsers));
adminRouter.get('/active', nextError(adminController.getActiveUsers));

adminRouter.get('/', nextError(adminController.findAll));

export { adminRouter };
