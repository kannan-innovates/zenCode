export const REDIS_KEYS = {
  OTP: (email: string) => `otp:${email}`,
  REGISTRATION: (email: string) => `registration:${email}`,
  RESET_PASSWORD: (token: string) => `reset-password:${token}`,
  OTP_META: (email:string) => `otp-meta:${email}`
};