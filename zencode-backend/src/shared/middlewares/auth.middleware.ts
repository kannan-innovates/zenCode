import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JWTPayload } from '@shared/utils/jwt.util';
import { sendError } from '@shared/utils/response.util';
import logger from '@shared/utils/logger.util';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Access token required', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload; // Attach decoded user info to request
    next();
  } catch (error: any) {
    logger.warn('Authentication failed', {
      ip: req.ip,
      error: error.message,
    });
    return sendError(res, 'Invalid or expired token', 401);
  }
};