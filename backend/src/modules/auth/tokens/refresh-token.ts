import jwt from 'jsonwebtoken';
import { SignOptions } from "jsonwebtoken";
import { RefreshTokenPayload } from './token.type';

if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
}

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const REFRESH_EXPIRY: string = process.env.JWT_REFRESH_EXPIRY || '7d';

export const generateRefreshToken = (
  payload: Omit<RefreshTokenPayload, 'type'>
): string => {
  const options: SignOptions = { expiresIn: REFRESH_EXPIRY as any };
  return jwt.sign(
    { ...payload, type: 'refresh' },
    REFRESH_SECRET,
    options
  );
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const payload = jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload;

  if (payload.type !== 'refresh') {
    throw new Error('Invalid refresh token type');
  }
  return payload;
};