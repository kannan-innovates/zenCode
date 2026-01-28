import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../constants/status';
import { sendError } from '../utils/response.util';

export const errorHandler = (
     err: any,
     req: Request,
     res: Response,
     next: NextFunction,
): void => {

     const statusCode =
          err.statusCode && Number.isInteger(err.statusCode)
               ? err.statusCode
               : STATUS_CODES.INTERNAL_SERVER_ERROR;

     const message =
          err.message || 'Something went wrong';

     sendError(
          res,
          message,
          statusCode,
          err.code,      
          err.details,  
     );
};