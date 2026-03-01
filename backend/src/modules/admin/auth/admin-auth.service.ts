
import { adminAuthRepository } from "./admin-auth.repository";
import { AdminLoginInput } from "./types/admin-login.input"
import { AppError } from "../../../shared/utils/AppError";
import { STATUS_CODES } from "../../../shared/constants/status";
import { AUTH_MESSAGES } from "../../../shared/constants/messages";
import { passwordService } from "../../../shared/utils/password.util";
import { TokenService } from "../../auth/tokens/token.service";
import { CacheService } from "../../../shared/cache/cache.service";
import { REDIS_KEYS } from "../../../shared/constants/redis.keys";
import { parseExpiryToSeconds } from "../../../shared/utils/expiry.util";
import { REFRESH_TOKEN_EXPIRY } from "../../../shared/constants/token.constants";
import { verifyRefreshToken } from "../../auth/tokens/refresh-token";

export class AdminAuthService {

     async login(input: AdminLoginInput) {

          const { email, password } = input;

          const admin = await adminAuthRepository.findAdminByEmail(email);

          if (!admin) {
               throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND, STATUS_CODES.UNAUTHORIZED);
          }
          if (admin.isBlocked) {
               throw new AppError(AUTH_MESSAGES.USER_BLOCKED, STATUS_CODES.FORBIDDEN);
          }
          if (!admin.password) {
               throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND, STATUS_CODES.UNAUTHORIZED);
          }
          const isMatch = await passwordService.compare(password, admin.password);
          if (!isMatch) {
               throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED)
          }

          const { accessToken, refreshToken, refreshTokenId } = TokenService.generateAuthTokens({
               id: admin.id,
               role: admin.role,
          });

          const refreshKey = REDIS_KEYS.REFRESH_TOKEN(refreshTokenId);
          const refreshTTL = parseExpiryToSeconds(REFRESH_TOKEN_EXPIRY);
          await CacheService.set(refreshKey, admin._id, refreshTTL);

          return { accessToken, refreshToken };
     }

     async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
          const payload = verifyRefreshToken(refreshToken);

          const oldRefreshKey = REDIS_KEYS.REFRESH_TOKEN(payload.tokenId);
          const storedUserId = await CacheService.get<string>(oldRefreshKey);

          if (!storedUserId || storedUserId !== payload.sub) {
               throw new AppError(AUTH_MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
          }

          const admin = await adminAuthRepository.findById(payload.sub);

          if (!admin || admin.isBlocked) {
               throw new AppError(AUTH_MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
          }

          await CacheService.del(oldRefreshKey);

          const { accessToken, refreshToken: newRefreshToken, refreshTokenId } =
               TokenService.generateAuthTokens({ id: admin.id, role: admin.role });

          const newRefreshKey = REDIS_KEYS.REFRESH_TOKEN(refreshTokenId);
          const refreshTTL = parseExpiryToSeconds(REFRESH_TOKEN_EXPIRY);
          await CacheService.set(newRefreshKey, admin.id, refreshTTL);

          return { accessToken, refreshToken: newRefreshToken };
     }

     async logout(refreshToken: string): Promise<void> {
          let payload;
          try {
               payload = verifyRefreshToken(refreshToken);
          } catch {
               return; 
          }
          const refreshKey = REDIS_KEYS.REFRESH_TOKEN(payload.tokenId);
          await CacheService.del(refreshKey);
     }
}