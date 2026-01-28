import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

router.post(
  '/register',
  authController.startRegistration.bind(authController)
);

router.post(
  '/verify-otp',
  authController.verifyRegistration.bind(authController)
);

export default router;