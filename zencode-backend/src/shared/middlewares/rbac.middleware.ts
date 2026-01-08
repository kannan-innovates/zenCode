import { Request, Response, NextFunction } from 'express';
import { sendError } from '@shared/utils/response.util';
import { UserRole } from '@shared/constants/roles';

export const restrictTo = (...allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return sendError(res, 'Forbidden: Insufficient role permissions', 403);
    }

    next();
  };