import { Request, Response, NextFunction } from "express";
import { RegistrationService } from "./service/registration.service";
import { sendSuccess } from "../../shared/utils/response.util";
import { STATUS_CODES } from "../../shared/constants/status";
import { AUTH_MESSAGES } from "../../shared/constants/messages";


export class AuthController {

     private readonly _registrationService = new RegistrationService();

     // POST | auth/register
     async startRegistration(
          req: Request,
          res: Response,
          next: NextFunction,
     ): Promise<void> {
          try {
               await this._registrationService.startRegistration(req.body);

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: AUTH_MESSAGES.OTP_SENT,
               });
          } catch (error) {
               next(error);
          }
     }
     
     // POST | verify-otp
     async verifyRegistration(
          req: Request,
          res: Response,
          next: NextFunction,
     ): Promise<void >{
          try{
               await this._registrationService.verifyRegistration(req.body);

               sendSuccess(res,{
                    statusCode: STATUS_CODES.CREATED,
                    message: AUTH_MESSAGES.REGISTER_SUCCESS,
               });

          }catch(error){
               next (error);
          }
     }
}

export const authController = new AuthController();