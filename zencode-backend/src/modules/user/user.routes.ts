import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updateAvatar,
} from './user.controller';
import { authenticate } from '@shared/middlewares/auth.middleware';
import { uploadAvatar } from '@shared/middlewares/upload.middleware';

const router = Router();

router.use(authenticate);

router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.patch('/me/avatar', uploadAvatar, updateAvatar);

export default router;