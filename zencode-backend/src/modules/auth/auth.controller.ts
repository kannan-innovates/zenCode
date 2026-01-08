import { Request, Response } from 'express';
import * as authService from '@modules/auth/auth.service';
import { sendSuccess, sendError } from '@shared/utils/response.util';
import logger from '@shared/utils/logger.util';

export const register = async (req: Request, res: Response) => {
  try {
    const tokens = await authService.register(req.body);
    sendSuccess(res, tokens, 'Registration successful. Check your email for OTP.');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const tokens = await authService.login(req.body);
    sendSuccess(res, tokens, 'Login successful');
  } catch (error: any) {
    sendError(res, error.message, 401);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new Error('Refresh token required');

    const { accessToken } = await authService.refreshToken(refreshToken);
    sendSuccess(res, { accessToken });
  } catch (error: any) {
    sendError(res, error.message, 401);
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyEmailWithOTP(email, otp);
    sendSuccess(res, null, 'Email verified successfully');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    sendSuccess(res, null, 'If the email exists, a reset link has been sent');
  } catch (error: any) {
    sendError(res, 'Something went wrong', 500);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    sendSuccess(res, null, 'Password reset successfully');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};