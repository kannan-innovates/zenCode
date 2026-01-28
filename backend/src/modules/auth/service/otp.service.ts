import { CacheService } from "../../../shared/cache/cache.service";
import { REDIS_KEYS } from "../../../shared/constants/redis.keys";

const OTP_EXPIRY_SECONDS =
     Number(process.env.OTP_EXPIRY_MINUTES || 5) * 60;

const OTP_LENGTH =
     Number(process.env.OTP_LENGTH || 6);


export class OTPService {

     generateOTP(): string {
          const min = Math.pow(10, OTP_LENGTH - 1);
          const max = Math.pow(10, OTP_LENGTH) - 1;
          return Math.floor(min + Math.random() * (max - min + 1)).toString();
     }

     async storeOTP(email: string, otp: string): Promise<void> {
          const key = REDIS_KEYS.OTP(email);
          await CacheService.set(key, otp, OTP_EXPIRY_SECONDS);
     }

     async verifyOTP(email: string, otp: string): Promise<boolean> {
          const key = REDIS_KEYS.OTP(email);
          const storedOTP = await CacheService.get<string>(key);

          if (!storedOTP) return false;
          if (storedOTP !== otp) return false;

          await CacheService.del(key);
          return true;
     }

     async storeRegistrationData<T>(email: string, data: T): Promise<void> {
          const key = REDIS_KEYS.REGISTRATION(email);
          await CacheService.set(key, data, OTP_EXPIRY_SECONDS);
     }

     async getRegistrationData<T>(email: string): Promise<T | null> {
          const key = REDIS_KEYS.REGISTRATION(email);
          return CacheService.get<T>(key);
     }

     async deleteRegistrationData(email: string): Promise<void> {
          const key = REDIS_KEYS.REGISTRATION(email);
          await CacheService.del(key);
     }
}

export const otpService = new OTPService()