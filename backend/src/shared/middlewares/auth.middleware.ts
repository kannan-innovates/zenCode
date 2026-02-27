import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../modules/auth/tokens/access-token';
import { authRepository } from '../../modules/auth/auth.repository';
import { AppError } from '../utils/AppError';
import { STATUS_CODES } from '../constants/status';
import { AUTH_MESSAGES } from '../constants/messages';

export const authMiddleware = async (
     req: Request,
     _res: Response,
     next: NextFunction,
): Promise<void> => {
     try {
          const authHeader = req.headers.authorization;

          if (!authHeader || !authHeader.startsWith('Bearer ')) {
               throw new AppError(
                    AUTH_MESSAGES.UNAUTHORIZED,
                    STATUS_CODES.UNAUTHORIZED
               );
          }

          const token = authHeader.split(' ')[1];

          const payload = verifyAccessToken(token);


          const user = await authRepository.findById(payload.sub);

          if (!user || user.isBlocked) {
               throw new AppError(
                    AUTH_MESSAGES.UNAUTHORIZED,
                    STATUS_CODES.UNAUTHORIZED
               );
          }

          req.user = {
               id: user.id,
               role: user.role,
          };

          next();
     } catch (error) {
          next(error);
     }
};