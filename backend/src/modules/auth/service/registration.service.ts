import { RegistrationCacheData, StartRegistrationInput, VerifyRegistrationInput } from "../types/registration.types";
import { EmailService } from "./email.service";
import { authRepository } from "../auth.repository";
import { otpService } from "./otp.service";
import { passwordService } from "../../../shared/utils/password.util";
import { UserRole } from "../../../shared/constants/roles";

export class RegistrationService {
     private _emailService = new EmailService();

     async startRegistration(input: StartRegistrationInput): Promise<void> {
          const { fullName, email, password, confirmPassword } = input;

          if (password !== confirmPassword) {
               throw new Error("Passwords do not match");
          }

          const existingUser = await authRepository.findByEmail(email);
          if (existingUser) {
               throw new Error("Email already registered");
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
               throw new Error('Invalid or Expired OTP');
          }

          const regData = await otpService.getRegistrationData<RegistrationCacheData>(email);

          if (!regData) {
               throw new Error('Registration Data expired');
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