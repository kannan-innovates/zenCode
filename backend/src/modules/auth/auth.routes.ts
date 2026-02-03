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

router.post(
  '/resend-otp',
  authController.resendOTP.bind(authController)
);

router.post(
  '/login',
  authController.login.bind(authController)
);



export default router;