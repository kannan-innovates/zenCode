import { MentorLoginInput } from './types/mentor-login.input';
import { mentorAuthRepository } from './mentor-auth.repository';
import { AppError } from '../../../shared/utils/AppError';
import { STATUS_CODES } from '../../../shared/constants/status';
import { AUTH_MESSAGES } from '../../../shared/constants/messages';
import { passwordService } from '../../../shared/utils/password.util';
import { TokenService } from '../../auth/tokens/token.service';
import { CacheService } from '../../../shared/cache/cache.service';
import { REDIS_KEYS } from '../../../shared/constants/redis.keys';
import { parseExpiryToSeconds } from '../../../shared/utils/expiry.util';
import { REFRESH_TOKEN_EXPIRY } from '../../../shared/constants/token.constants';
import { verifyRefreshToken } from '../../auth/tokens/refresh-token';

export class MentorAuthService {

  async login(input: MentorLoginInput) {
    const { email, password } = input;

    const mentor = await mentorAuthRepository.findMentorByEmail(email);

    if (!mentor) {
      throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND, STATUS_CODES.UNAUTHORIZED);
    }

    if (mentor.isBlocked) {
      throw new AppError(AUTH_MESSAGES.USER_BLOCKED, STATUS_CODES.FORBIDDEN);
    }

    if (!mentor.isEmailVerified) {
      throw new AppError(
        'Mentor account not activated',
        STATUS_CODES.FORBIDDEN
      );
    }

    if (!mentor.password) {
      throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
    }

    const isMatch = await passwordService.compare(password, mentor.password);
    if (!isMatch) {
      throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
    }

    const { accessToken, refreshToken, refreshTokenId } =
      TokenService.generateAuthTokens({
        id: mentor.id,
        role: mentor.role,
      });

    const refreshKey = REDIS_KEYS.REFRESH_TOKEN(refreshTokenId);
    const refreshTTL = parseExpiryToSeconds(REFRESH_TOKEN_EXPIRY);

    await CacheService.set(refreshKey, mentor.id, refreshTTL);

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const oldKey = REDIS_KEYS.REFRESH_TOKEN(payload.tokenId);
    const storedUserId = await CacheService.get<string>(oldKey);

    if (!storedUserId || storedUserId !== payload.sub) {
      throw new AppError(AUTH_MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    }

    const mentor = await mentorAuthRepository.findById(payload.sub);

    if (!mentor || mentor.isBlocked) {
      throw new AppError(AUTH_MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    }

    await CacheService.del(oldKey);

    const { accessToken, refreshToken: newRefreshToken, refreshTokenId } =
      TokenService.generateAuthTokens({
        id: mentor.id,
        role: mentor.role,
      });

    const newKey = REDIS_KEYS.REFRESH_TOKEN(refreshTokenId);
    const ttl = parseExpiryToSeconds(REFRESH_TOKEN_EXPIRY);

    await CacheService.set(newKey, mentor.id, ttl);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const key = REDIS_KEYS.REFRESH_TOKEN(payload.tokenId);
      await CacheService.del(key);
    } catch {
      return;
    }
  }
}