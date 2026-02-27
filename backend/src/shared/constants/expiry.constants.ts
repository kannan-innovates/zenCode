export const EXPIRY_TIMES = {
     OTP: {
          SECONDS: Number(process.env.OTP_EXPIRY_MINUTES || 5) * 60,
          LABEL: '5 minutes'
     },
     PASSWORD_RESET: {
          SECONDS: 15 * 60,
          LABEL: '15 minutes'
     },
     MENTOR_INVITE: {
          SECONDS: 24 * 60 * 60,
          LABEL: '24 hours'
     }
};
