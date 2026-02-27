import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../constants/roles';
import { AppError } from '../utils/AppError';
import { STATUS_CODES } from '../constants/status';

export const roleGuard =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new AppError('Access denied', STATUS_CODES.FORBIDDEN);
    }
    next();
  };