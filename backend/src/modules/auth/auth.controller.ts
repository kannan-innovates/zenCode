import { Request, Response, NextFunction } from "express";
import { RegistrationService } from "./service/registration.service";
import { sendSuccess } from "../../shared/utils/response.util";
import { STATUS_CODES } from "../../shared/constants/status";
import { AUTH_MESSAGES } from "../../shared/constants/messages";
import { ResendOTPService } from "./service/resend-otp-service";
import { LoginService } from "./service/login.service";

export class AuthController {

     private readonly _registrationService = new RegistrationService();
     private readonly _resendOTPService = new ResendOTPService();
     private readonly _loginService = new LoginService();

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

     // POST | auth/verify-otp
     async verifyRegistration(
          req: Request,
          res: Response,
          next: NextFunction,
     ): Promise<void> {
          try {
               await this._registrationService.verifyRegistration(req.body);

               sendSuccess(res, {
                    statusCode: STATUS_CODES.CREATED,
                    message: AUTH_MESSAGES.REGISTER_SUCCESS,
               });

          } catch (error) {
               next(error);
          }
     }

     //POST | auth/resend-otp
     async resendOTP(
          req: Request,
          res: Response,
          next: NextFunction,
     ): Promise<void> {
          try {
               const { email } = req.body;
               await this._resendOTPService.resend(email);
               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: AUTH_MESSAGES.OTP_SENT,
               });

          } catch (error) {
               next(error);
          }
     }

     // POST | auth/login
     async login(
          req: Request,
          res: Response,
          next: NextFunction,
     ): Promise<void> {
          try {
               const { accessToken, refreshToken } =
                    await this._loginService.login(req.body);

               res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
               });

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: AUTH_MESSAGES.LOGIN_SUCCESS,
                    data: { accessToken },
               });
          } catch (error) {
               next(error);
          }
     }

     // POST | auth/refresh
     async refresh(
          req: Request,
          res: Response,
          next: NextFunction,
     ): Promise<void> {
          try {
               const refreshToken = req.cookies?.refreshToken;

               if (!refreshToken) {
                    throw new Error(AUTH_MESSAGES.UNAUTHORIZED);
               }

               const accessToken =
                    await this._loginService.refresh(refreshToken);

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    data: { accessToken },
               });
          } catch (error) {
               next(error);
          }
     }

     // POST | auth/logout
     async logout(
          req: Request,
          res: Response,
          next: NextFunction,
     ): Promise<void> {
          try {
               const refreshToken = req.cookies?.refreshToken;

               if (refreshToken) {
                    await this._loginService.logout(refreshToken);
               }

               res.clearCookie('refreshToken', {
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: process.env.NODE_ENV === 'production',
               });

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: AUTH_MESSAGES.LOGOUT_SUCCESS,
               });
          } catch (error) {
               next(error);
          }
     }
}

export const authController = new AuthController();