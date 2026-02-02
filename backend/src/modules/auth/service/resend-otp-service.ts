import { otpService } from "./otp.service";
import { otpRepository } from "../repositories/otp.respository";
import { EmailService } from "./email.service";
import { OTP_LIMITS } from "../../../shared/constants/otp.constants";

export class ResendOTPService {
     private _emailService = new EmailService();

     async resend(email: string): Promise<void> {

          const registrationData = await otpService.getRegistrationData(email);
          if (!registrationData) {
               throw new Error("No pending registration found");
          }

          const meta = await otpRepository.getMeta(email);
          const now = Date.now();

          if (meta) {
               const diff = (now - meta.lastSend) / 1000;
               if (diff < OTP_LIMITS.RESEND_COOLDOWN_SECONDS) {
                    throw new Error("Please wait before requesting another OTP");
               }

               if (meta.resendCount >= OTP_LIMITS.MAX_RESEND_ATTEMPTS) {
                    throw new Error("OTP resend limit exceeded");
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