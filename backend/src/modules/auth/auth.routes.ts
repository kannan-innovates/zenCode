import { Router } from 'express';
import { authController } from './auth.controller';
import passport from '../../config/passport';
import { validateRequest } from '../../shared/middlewares/validate.middleware';
import {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validator';

const router = Router();

router.post(
  '/register',
  validateRequest(registerSchema),
  authController.startRegistration.bind(authController)
);

router.post(
  '/verify-otp',
  validateRequest(verifyOtpSchema),
  authController.verifyRegistration.bind(authController)
);

router.post(
  '/resend-otp',
  validateRequest(resendOtpSchema),
  authController.resendOTP.bind(authController)
);

router.post(
  '/login',
  validateRequest(loginSchema),
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

router.post(
  '/forgot-password',
  validateRequest(forgotPasswordSchema),
  authController.forgotPassword.bind(authController)
);

router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema),
  authController.resetPassword.bind(authController)
);


router.get(
  '/reset-password/validate',
  authController.validateResetToken.bind(authController)
);

export default router;