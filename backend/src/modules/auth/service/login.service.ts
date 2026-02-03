import { authRepository } from "../auth.repository";
import { passwordService, } from "../../../shared/utils/password.util";
import { TokenService } from "../tokens/token.service";
import { REDIS_KEYS } from "../../../shared/constants/redis.keys";
import { AUTH_MESSAGES } from "../../../shared/constants/messages";
import { CacheService } from "../../../shared/cache/cache.service";
import { parseExpiryToSeconds } from "../../../shared/utils/expiry.util";
import { REFRESH_TOKEN_EXPIRY } from "../../../shared/constants/token.constants";
import { verifyRefreshToken } from '../tokens/refresh-token';
import { generateAccessToken } from '../tokens/access-token';
import { AppError } from "../../../shared/utils/AppError";
import { STATUS_CODES } from "../../../shared/constants/status";


export class LoginService {

     async login(input: { email: string; password: string }) {
          const { email, password } = input;
          const user = await authRepository.findByEmail(email);

          if (!user) {
               throw new AppError(
                    AUTH_MESSAGES.INVALID_CREDENTIALS,
                    STATUS_CODES.UNAUTHORIZED
               );
          }

          if (user.isBlocked) {
               throw new AppError(
                    AUTH_MESSAGES.USER_BLOCKED,
                    STATUS_CODES.FORBIDDEN
               );
          }

          if (!user.password) {
               throw new AppError(
                    AUTH_MESSAGES.INVALID_CREDENTIALS,
                    STATUS_CODES.UNAUTHORIZED
               );
          }

          const isPasswordValid = await passwordService.compare(
               password,
               user.password
          );

          if (!isPasswordValid) {
               throw new AppError(
                    AUTH_MESSAGES.INVALID_CREDENTIALS,
                    STATUS_CODES.UNAUTHORIZED
               );
          }

          user.lastActiveDate = new Date();
          await user.save();

          const { accessToken, refreshToken, refreshTokenId } =
               TokenService.generateAuthTokens({
                    id: user.id,
                    role: user.role,
               });

          const refreshKey = REDIS_KEYS.REFRESH_TOKEN(refreshTokenId);
          const refreshTTL = parseExpiryToSeconds(REFRESH_TOKEN_EXPIRY);

          await CacheService.set(
               refreshKey,
               user._id,
               refreshTTL
          );

          return {
               accessToken,
               refreshToken,
          }
     }

     async refresh(refreshToken: string): Promise<string> {
          const payload = verifyRefreshToken(refreshToken);

          const refreshKey = REDIS_KEYS.REFRESH_TOKEN(payload.tokenId);
          const storedUserId = await CacheService.get<string>(refreshKey);

          if (!storedUserId || storedUserId !== payload.sub) {
               throw new AppError(
                    AUTH_MESSAGES.UNAUTHORIZED,
                    STATUS_CODES.UNAUTHORIZED
               );
          }

          const user = await authRepository.findById(payload.sub);


          if (!user || user.isBlocked) {
               throw new AppError(
                    AUTH_MESSAGES.UNAUTHORIZED,
                    STATUS_CODES.UNAUTHORIZED
               );
          }

          user.lastActiveDate = new Date();
          await user.save();

          const accessToken = generateAccessToken({
               sub: user.id,
               role: user.role,
          });

          return accessToken;
     }

     async logout(refreshToken: string): Promise<void> {
          let payload;

          try {
               payload = verifyRefreshToken(refreshToken);
          } catch {
               // Token already invalid → nothing to clean
               return;
          }

          const refreshKey = REDIS_KEYS.REFRESH_TOKEN(payload.tokenId);
          await CacheService.del(refreshKey);
     }
}