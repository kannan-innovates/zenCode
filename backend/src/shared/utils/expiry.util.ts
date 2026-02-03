
export const parseExpiryToSeconds = (expiry: string): number => {
     const value = parseInt(expiry, 10);
     const unit = expiry.replace(value.toString(), '');

     switch (unit) {
          case 's': return value;
          case 'm': return value * 60;
          case 'h': return value * 60 * 60;
          case 'd': return value * 24 * 60 * 60;
          default:
               throw new Error(`Invalid expiry format: ${expiry}`);
     }
};