import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../constants/status';
import { sendError } from '../utils/response.util';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode =
    err instanceof AppError
      ? err.statusCode
      : STATUS_CODES.INTERNAL_SERVER_ERROR;

  const message =
    err instanceof AppError
      ? err.message
      : 'Something went wrong';

  sendError(res, {
    statusCode,
    message,
  });
};