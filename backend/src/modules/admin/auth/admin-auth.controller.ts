import { Request, Response, NextFunction } from "express";
import { AdminAuthService } from "./admin-auth.service";
import { sendSuccess } from "../../../shared/utils/response.util";
import { STATUS_CODES } from "../../../shared/constants/status";
import { AppError } from "../../../shared/utils/AppError";
import { AUTH_MESSAGES } from "../../../shared/constants/messages";

export class AdminAuthController {
     constructor(
          private readonly _adminAuthService: AdminAuthService
     ) { }

     async login(req: Request, res: Response, next: NextFunction) {
          try {
               const { accessToken, refreshToken } =
                    await this._adminAuthService.login(req.body);

               res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
               });

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: 'Admin login successful',
                    data: { accessToken },
               });
          } catch (error) {
               next(error);
          }
     }

     async refresh(req: Request, res: Response, next: NextFunction) {
          try {
               const refreshToken = req.cookies?.refreshToken;

               if (!refreshToken) {
                    throw new AppError(AUTH_MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
               }

               const { accessToken, refreshToken: newRefreshToken } =
                    await this._adminAuthService.refresh(refreshToken);

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

     async logout(req: Request, res: Response, next: NextFunction) {
          try {
               const refreshToken = req.cookies?.refreshToken;

               if (refreshToken) {
                    await this._adminAuthService.logout(refreshToken);
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