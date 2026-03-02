import { Router } from 'express';
import { AdminMentorController } from './admin-mentor.controller';
import { AdminMentorService } from './admin-mentor.service';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { roleGuard } from '../../shared/middlewares/role-guard.middleware';
import { UserRole } from '../../shared/constants/roles';
import { validateRequest } from '../../shared/middlewares/validate.middleware';
import adminAuthRouter from './auth/admin-auth.routes';
import {
  createMentorSchema,
  activateMentorSchema,
} from './mentor/validators/mentor.validator';

const router = Router();

router.use('/auth', adminAuthRouter);
const adminMentorService = new AdminMentorService();
const adminMentorController = new AdminMentorController(adminMentorService);


router.post(
  '/mentors',
  authMiddleware,
  roleGuard(UserRole.ADMIN),
  validateRequest(createMentorSchema),
  adminMentorController.createMentor.bind(adminMentorController)
);


router.post(
  '/mentors/invite',
  validateRequest(activateMentorSchema),
  adminMentorController.activateMentor.bind(adminMentorController)
);

export default router;