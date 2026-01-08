import { Response } from 'express';
import { STATUS_CODES } from '@shared/constants/status';

/**
 * Standard API response format
 * Ensures all responses look the same
 */
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = STATUS_CODES.OK,
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = STATUS_CODES.INTERNAL_SERVER_ERROR,
  errorCode?: string,
  details?: any,
): void => {
  const response: ApiResponse = {
    success: false,
    error: {
      code: errorCode || `ERROR_${statusCode}`,
      message,
      ...(details && { details }),
    },
  };

  res.status(statusCode).json(response);
};