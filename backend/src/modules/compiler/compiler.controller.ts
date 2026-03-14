import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../shared/types/authenticated-request';
import { CompilerService } from './compiler.service';
import { sendSuccess } from '../../shared/utils/response.util';
import { STATUS_CODES } from '../../shared/constants/status';


export class CompilerController {
     private compilerService: CompilerService;

     constructor() {
          this.compilerService = new CompilerService();
     }

     executeCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
          try {
               const token = await this.compilerService.createExecution(req.body);

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: 'Execution started',
                    data: token,
               });
          } catch (error) {
               next(error);
          }
     };

     getResult = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
          try {
               const result = await this.compilerService.getExecutionResult(req.params.token as string);

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: 'Execution result',
                    data: result,
               });
          } catch (error) {
               next(error);
          }
     };
}