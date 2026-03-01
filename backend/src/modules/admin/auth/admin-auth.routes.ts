import { Router } from 'express';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { validateRequest } from '../../../shared/middlewares/validate.middleware';
import { adminLoginSchema } from './validators/admin-login.validator';

const router = Router();

const service = new AdminAuthService();
const controller = new AdminAuthController(service);

router.post(
  '/login',
  validateRequest(adminLoginSchema),
  controller.login.bind(controller)
);

router.post('/refresh', controller.refresh.bind(controller));

router.post('/logout', controller.logout.bind(controller));

export default router;