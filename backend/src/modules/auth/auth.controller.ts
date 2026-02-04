import { Request, Response, NextFunction } from "express";
import { RegistrationService } from "./service/registration.service";
import { sendSuccess } from "../../shared/utils/response.util";
import { STATUS_CODES } from "../../shared/constants/status";
import { AUTH_MESSAGES } from "../../shared/constants/messages";
import { ResendOTPService } from "./service/resend-otp-service";
import { LoginService } from "./service/login.service";
import { AppError } from "../../shared/utils/AppError";
import { googleAuthService, } from "./service/google-auth.service";
import { PasswordService } from "./service/password.service";


export class AuthController {

     private readonly _registrationService = new RegistrationService();
     private readonly _resendOTPService = new ResendOTPService();
     private readonly _loginService = new LoginService();
     private readonly _passwordService = new PasswordService();

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
                    throw new AppError(
                         AUTH_MESSAGES.UNAUTHORIZED,
                         STATUS_CODES.UNAUTHORIZED
                    );
               }

               const { accessToken, refreshToken: newRefreshToken } =
                    await this._loginService.refresh(refreshToken);

               res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
               });

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

     // GET | auth/google
     googleAuth(req: Request, res: Response, next: NextFunction): void {
          // Handled by Passport middleware
     }

     async googleCallback(
          req: Request,
          res: Response,
          next: NextFunction
     ): Promise<void> {
          try {
               const profile = req.user as any;

               if (!profile) {
                    throw new AppError(
                         'Google authentication failed',
                         STATUS_CODES.UNAUTHORIZED
                    );
               }

               const { accessToken, refreshToken } =
                    await googleAuthService.authenticateGoogleUser(profile);

               // Set refresh token in cookie
               res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
               });

               // Redirect to frontend with access token
               const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
               res.redirect(`${frontendUrl}/auth/google/success?token=${accessToken}`);
          } catch (error) {
               next(error);
          }
     }

     //POST | forgot-password
     async forgotPassword(req: Request, res: Response, next: NextFunction) {
          try {
               await this._passwordService.forgotPassword(req.body.email);

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: AUTH_MESSAGES.PASSWORD_RESET_LINK_SENT,
               });
          } catch (error) {
               next(error);
          }
     }

     //POST | reset-password
     async resetPassword(req: Request, res: Response, next: NextFunction) {
          try {
               const { token, newPassword } = req.body;

               await this._passwordService.resetPassword(token, newPassword);

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS,
               });
          } catch (error) {
               next(error);
          }
     }

     // GET | auth/reset-password/validate
     async validateResetToken(
          req: Request,
          res: Response,
          next: NextFunction
     ): Promise<void> {
          try {
               const { token } = req.query;

               if (!token || typeof token !== 'string') {
                    throw new AppError('Token is required', STATUS_CODES.BAD_REQUEST);
               }

               const isValid = await this._passwordService.validateResetToken(token);

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    data: { valid: isValid },
               });
          } catch (error) {
               next(error);
          }
     }

}

export const authController = new AuthController();