import  jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import { AccessTokenPayload } from "./token.type";

if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const ACCESS_EXPIRY: string = process.env.JWT_ACCESS_EXPIRY || '15m';

export const generateAccessToken = (
  payload: Omit<AccessTokenPayload, 'type'>
): string => {
  const options: SignOptions = { expiresIn: ACCESS_EXPIRY as any };
  return jwt.sign(
    { ...payload, type: 'access' },
    ACCESS_SECRET,
    options
  );
};


export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const payload = jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;

  if (payload.type !== 'access') {
    throw new Error('Invalid access token type');
  }

  return payload;
};