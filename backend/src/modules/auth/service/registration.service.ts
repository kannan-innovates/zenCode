import { RegistrationCacheData, StartRegistrationInput, VerifyRegistrationInput } from "../types/registration.types";
import { EmailService } from "./email.service";
import { authRepository } from "../auth.repository";
import { otpService } from "./otp.service";
import { passwordService } from "../../../shared/utils/password.util";
import { UserRole } from "../../../shared/constants/roles";
import { AppError } from "../../../shared/utils/AppError";
import { STATUS_CODES } from "../../../shared/constants/status";
import { AUTH_MESSAGES } from "../../../shared/constants/messages";

export class RegistrationService {
     private _emailService = new EmailService();

     async startRegistration(input: StartRegistrationInput): Promise<void> {
          const { fullName, email, password, confirmPassword } = input;

          if (password !== confirmPassword) {
               throw new AppError(
                    AUTH_MESSAGES.PASSWORDS_DO_NOT_MATCH,
                    STATUS_CODES.BAD_REQUEST
               );
          }

          const existingUser = await authRepository.findByEmail(email);
          if (existingUser) {
               throw new AppError(
                    AUTH_MESSAGES.EMAIL_ALREADY_EXISTS,
                    STATUS_CODES.CONFLICT
               );
          }

          const otp = otpService.generateOTP();

          await otpService.storeOTP(email, otp);

          await otpService.storeRegistrationData(email, {
               fullName,
               email,
               password,
          });

          await this._emailService.sendOTP(email, otp);
     }


     async verifyRegistration(input: VerifyRegistrationInput): Promise<void> {
          const { email, otp } = input;
          const isValid = await otpService.verifyOTP(email, otp);

          if (!isValid) {
               throw new AppError(
                    AUTH_MESSAGES.INVALID_OTP,
                    STATUS_CODES.BAD_REQUEST
               );
          }

          const regData = await otpService.getRegistrationData<RegistrationCacheData>(email);

          if (!regData) {
               throw new AppError(
                    AUTH_MESSAGES.REGISTRATION_DATA_EXPIRED,
                    STATUS_CODES.BAD_REQUEST
               );
          }

          const hashedPassword = await passwordService.hash(regData.password);

          await authRepository.createUser({
               fullName: regData.fullName,
               email: regData.email,
               password: hashedPassword,
               isEmailVerified: true,
               role: UserRole.CANDIDATE
          });

          await otpService.deleteRegistrationData(email);
     }
}