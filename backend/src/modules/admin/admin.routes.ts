import { Router } from 'express';
import { AdminMentorController } from './admin.mentor.controller';
import { AdminMentorService } from './admin.mentor.service';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { roleGuard } from '../../shared/middlewares/role-guard.middleware';
import { UserRole } from '../../shared/constants/roles';
import { validateRequest } from '../../shared/middlewares/validate.middleware';
import {
  createMentorSchema,
  activateMentorSchema,
} from './validators/mentor.validator';

const router = Router();
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
  '/mentors/activate',
  validateRequest(activateMentorSchema),
  adminMentorController.activateMentor.bind(adminMentorController)
);

export default router;