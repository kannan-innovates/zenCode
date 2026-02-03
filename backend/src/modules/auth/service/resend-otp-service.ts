import { otpService } from "./otp.service";
import { otpRepository } from "../repositories/otp.respository";
import { EmailService } from "./email.service";
import { OTP_LIMITS } from "../../../shared/constants/otp.constants";
import { AppError } from "../../../shared/utils/AppError";
import { STATUS_CODES } from "../../../shared/constants/status";
import { AUTH_MESSAGES } from "../../../shared/constants/messages";

export class ResendOTPService {
     private _emailService = new EmailService();

     async resend(email: string): Promise<void> {

          const registrationData = await otpService.getRegistrationData(email);
          if (!registrationData) {
               throw new AppError(
                    AUTH_MESSAGES.REGISTRATION_NOT_FOUND,
                    STATUS_CODES.NOT_FOUND
               );
          }

          const meta = await otpRepository.getMeta(email);
          const now = Date.now();

          if (meta) {
               const diff = (now - meta.lastSend) / 1000;
               if (diff < OTP_LIMITS.RESEND_COOLDOWN_SECONDS) {
                    throw new AppError(
                         AUTH_MESSAGES.OTP_COOLDOWN_ACTIVE,
                         STATUS_CODES.BAD_REQUEST
                    );
               }

               if (meta.resendCount >= OTP_LIMITS.MAX_RESEND_ATTEMPTS) {
                    throw new AppError(
                         AUTH_MESSAGES.OTP_RESEND_LIMIT_EXCEEDED,
                         STATUS_CODES.BAD_REQUEST
                    );
               }
          }

          const otp = otpService.generateOTP();
          await otpService.storeOTP(email, otp);

          await otpRepository.saveMeta(
               email,
               {
                    resendCount: meta ? meta.resendCount + 1 : 1,
                    lastSend: now,
               },
               OTP_LIMITS.RESEND_COOLDOWN_SECONDS * 10,
          );

          await this._emailService.sendOTP(email, otp);
     }
}