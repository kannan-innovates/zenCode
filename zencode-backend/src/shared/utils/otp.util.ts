import redisClient from '@shared/config/redis';
import logger from './logger.util';

const OTP_EXPIRY_SECONDS = Number(process.env.OTP_EXPIRY_MINUTES || 10) * 60;
const OTP_LENGTH = Number(process.env.OTP_LENGTH || 6);

/**
 * Generate a random 6-digit OTP
 */
export const generateOTP = (): string => {
  const min = Math.pow(10, OTP_LENGTH - 1); // 100000
  const max = Math.pow(10, OTP_LENGTH) - 1; // 999999
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
};

/**
 * Store OTP in Redis with expiry
 * Key format: "otp:user@example.com"
 */
export const storeOTP = async (email: string, otp: string): Promise<void> => {
  try {
    const key = `otp:${email}`;
    await redisClient.setWithExpiry(key, otp, OTP_EXPIRY_SECONDS);
    logger.info(`OTP stored for ${email}, expires in ${OTP_EXPIRY_SECONDS}s`);
  } catch (error) {
    logger.error('Error storing OTP:', error);
    throw new Error('Failed to store OTP');
  }
};

/**
 * Verify OTP from Redis
 * Returns true if OTP matches
 */
export const verifyOTP = async (
  email: string,
  otp: string,
): Promise<boolean> => {
  try {
    const key = `otp:${email}`;
    const storedOTP = await redisClient.get(key);

    if (!storedOTP) {
      logger.warn(`OTP not found or expired for ${email}`);
      return false;
    }

    if (storedOTP !== otp) {
      logger.warn(`Invalid OTP attempt for ${email}`);
      return false;
    }

    // OTP is valid - delete it so it can't be reused
    await redisClient.delete(key);
    logger.info(`OTP verified and deleted for ${email}`);
    return true;
  } catch (error) {
    logger.error('Error verifying OTP:', error);
    return false;
  }
};