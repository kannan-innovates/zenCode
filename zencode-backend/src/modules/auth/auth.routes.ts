import { Router } from 'express';
import {
  register,
  login,
  refresh,
  verifyOTP,
  forgotPassword,
  resetPassword,
} from '@modules/auth/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;