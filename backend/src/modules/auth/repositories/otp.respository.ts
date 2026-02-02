import { CacheService } from "../../../shared/cache/cache.service";
import { REDIS_KEYS } from "../../../shared/constants/redis.keys";

interface OTPMeta {
     resendCount: number;
     lastSend: number;
}

export class OTPRepository {
     async getMeta(email: string): Promise<OTPMeta | null> {
          return CacheService.get<OTPMeta>(REDIS_KEYS.OTP_META(email));
     }
     async saveMeta(email: string, meta: OTPMeta, ttl: number): Promise<void> {
          await CacheService.set(REDIS_KEYS.OTP_META(email), meta, ttl);
     }
     async clearAll(email: string): Promise<void>{
          await CacheService.del(REDIS_KEYS.OTP(email));
          await CacheService.del(REDIS_KEYS.OTP_META(email));
     }
}

export const otpRepository = new OTPRepository();