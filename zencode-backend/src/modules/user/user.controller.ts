import { Request, Response } from 'express';
import * as userService from './user.service';
import { sendSuccess, sendError } from '@shared/utils/response.util';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const profile = await userService.getProfile(userId);
    sendSuccess(res, profile);
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const profile = await userService.updateProfile(userId, req.body);
    sendSuccess(res, profile, 'Profile updated successfully');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded', 400);
    }

    const userId = (req as any).user.userId;
    const { avatarUrl } = await userService.updateAvatar(userId, req.file);

    sendSuccess(res, { avatarUrl }, 'Avatar updated successfully');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};