import jwt from 'jsonwebtoken';
import logger from './logger.util';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('JWT_ACCESS_SECRET not defined');

  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_ACCESS_EXPIRY || '15m') as any,
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET not defined');

  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRY || '7d') as any,
  });
};

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new Error('JWT_ACCESS_SECRET not defined');

    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    logger.error('Invalid access token:', error);
    throw new Error('Invalid or expired token');
  }
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error('JWT_REFRESH_SECRET not defined');

    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    logger.error('Invalid refresh token:', error);
    throw new Error('Invalid or expired refresh token');
  }
};