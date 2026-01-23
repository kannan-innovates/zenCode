export const REDIS_KEYS = {
  OTP: (email: string) => `otp:${email}`,
  RESET_PASSWORD: (token: string) => `reset-password:${token}`,
};