import { Router } from 'express';
import { authController } from './auth.controller';
import passport from '../../config/passport';

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

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.googleCallback.bind(authController)
);



export default router;