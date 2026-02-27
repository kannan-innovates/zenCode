import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response.util';
import { STATUS_CODES } from '../../shared/constants/status';
import { AdminMentorService } from './admin.mentor.service';
import { AuthenticatedRequest } from '../../shared/types/authenticated-request';



export class AdminMentorController {
     constructor(private readonly _adminMentorService: AdminMentorService) { }


     async createMentor(
          req: Request,
          res: Response,
          next: NextFunction,
     ): Promise<void> {
          try {
               const { user } = req as AuthenticatedRequest;
               const adminId = user.id;

               await this._adminMentorService.createMentor({
                    adminId,
                    data: req.body,
               });

               sendSuccess(res, {
                    statusCode: STATUS_CODES.CREATED,
                    message: 'Mentor invite sent successfully',
               });
          } catch (error) {
               next(error);
          }
     }

     async activateMentor(
          req: Request,
          res: Response,
          next: NextFunction,
     ): Promise<void> {
          try {
               await this._adminMentorService.activateMentor(req.body);

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: 'Mentor account activated successfully',
               });
          } catch (error) {
               next(error);
          }
     }
}
