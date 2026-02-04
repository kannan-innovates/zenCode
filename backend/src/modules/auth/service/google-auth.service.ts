import { authRepository } from "../auth.repository";
import { TokenService } from "../tokens/token.service";
import { REDIS_KEYS } from "../../../shared/constants/redis.keys";
import { CacheService } from "../../../shared/cache/cache.service";
import { parseExpiryToSeconds } from "../../../shared/utils/expiry.util";
import { REFRESH_TOKEN_EXPIRY } from "../../../shared/constants/token.constants";
import { UserRole } from "../../../shared/constants/roles";

interface GoogleProfile {
  id: string;
  displayName: string;
  emails: Array<{ value: string; verified: boolean }>;
  photos?: Array<{ value: string }>;
}

export class GoogleAuthService {
  async authenticateGoogleUser(profile: GoogleProfile) {
    const email = profile.emails[0].value;
    const googleId = profile.id;

    let user = await authRepository.findByEmail(email);

    if (!user) {
      // Create new user
      user = await authRepository.createUser({
        fullName: profile.displayName,
        email: email,
        googleId: googleId,
        avatarUrl: profile.photos?.[0]?.value,
        role: UserRole.CANDIDATE,
        isEmailVerified: true, 
      });
    } else {
      // Update existing user with Google ID if not present
      if (!user.googleId) {
        user.googleId = googleId;
        user.isEmailVerified = true;
        await user.save();
      }

      // Check if user is blocked
      if (user.isBlocked) {
        throw new Error('Account is blocked');
      }
    }

    // Update last active
    user.lastActiveDate = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken, refreshTokenId } =
      TokenService.generateAuthTokens({
        id: user.id,
        role: user.role,
      });

    const refreshKey = REDIS_KEYS.REFRESH_TOKEN(refreshTokenId);
    const refreshTTL = parseExpiryToSeconds(REFRESH_TOKEN_EXPIRY);

    await CacheService.set(refreshKey, user._id, refreshTTL);

    return {
      accessToken,
      refreshToken,
    };
  }
}

export const googleAuthService = new GoogleAuthService();