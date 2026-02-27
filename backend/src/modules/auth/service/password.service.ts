import crypto from 'crypto';
import { authRepository } from '../auth.repository';
import { REDIS_KEYS } from '../../../shared/constants/redis.keys';
import { CacheService } from '../../../shared/cache/cache.service';
import { passwordService } from '../../../shared/utils/password.util';
import { AppError } from '../../../shared/utils/AppError';
import { STATUS_CODES } from '../../../shared/constants/status';
import { AUTH_MESSAGES } from '../../../shared/constants/messages';
import { EmailService } from '../../../shared/email/email.service';
import { EXPIRY_TIMES } from '../../../shared/constants/expiry.constants';

export class PasswordService {

     private _emailService = new EmailService();

     async forgotPassword(email: string): Promise<void> {
          const user = await authRepository.findByEmail(email);

          if (!user || user?.isBlocked) return;

          const rawToken = crypto.randomBytes(32).toString('hex');

          const hashedToken = crypto
               .createHash('sha256')
               .update(rawToken)
               .digest('hex');

          await CacheService.set(REDIS_KEYS.RESET_PASSWORD(hashedToken), user.id, EXPIRY_TIMES.PASSWORD_RESET.SECONDS);

          const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

          await this._emailService.sendPasswordResetLink(user.email, resetLink);

     }


     async resetPassword(token: string, newPassword: string): Promise<void> {

          const hashedToken = crypto
               .createHash('sha256')
               .update(token)
               .digest('hex');

          const userId = await CacheService.get<string>(REDIS_KEYS.RESET_PASSWORD(hashedToken));

          if (!userId) {
               throw new AppError(
                    AUTH_MESSAGES.INVALID_TOKEN,
                    STATUS_CODES.BAD_REQUEST
               );
          }

          const user = await authRepository.findById(userId);
          if (!user) {
               throw new AppError(
                    AUTH_MESSAGES.INVALID_TOKEN,
                    STATUS_CODES.BAD_REQUEST
               );
          }
          user.password = await passwordService.hash(newPassword);
          await user.save();

          await CacheService.del(REDIS_KEYS.RESET_PASSWORD(hashedToken));
     }

     async validateResetToken(token: string): Promise<boolean> {
          const hashedToken = crypto
               .createHash('sha256')
               .update(token)
               .digest('hex');

          const userId = await CacheService.get<string>(REDIS_KEYS.RESET_PASSWORD(hashedToken));

          return !!userId;
     }
}