import User from '@modules/user/user.model';
import logger from '@shared/utils/logger.util';
import { hashPassword, comparePassword } from '@shared/utils/password.util';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
  JWTPayload,
} from '@shared/utils/jwt.util';
import { generateOTP, storeOTP, verifyOTP } from '@shared/utils/otp.util';
import emailService from '@shared/utils/email.util';
import { UserRole } from '@shared/constants/roles';



export const register = async (data: {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}) => {
  const { fullName, email, password, role } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    logger.warn('Registration failed: email already exists', { email });
    throw new Error('Email already in use');
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role,
    isEmailVerified: false,
    isBlocked: false,
  });

  const otp = generateOTP();
  await storeOTP(email, otp);
  await emailService.sendOTP(email, otp);

  logger.info('User registered successfully', { userId: user._id, email, role });

  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

export const login = async (data: { email: string; password: string }) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) {
    logger.warn('Login failed: user not found', { email });
    throw new Error('Invalid credentials');
  }

  if (user.isBlocked) {
    logger.warn('Login failed: account blocked', { email, userId: user._id });
    throw new Error('Account is blocked');
  }

  if (!user.password) {
    logger.warn('Login failed: no password set (possibly social login)', { email });
    throw new Error('Invalid credentials');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    logger.warn('Login failed: wrong password', { email });
    throw new Error('Invalid credentials');
  }

  user.lastActiveDate = new Date();
  await user.save();

  logger.info('User logged in successfully', { userId: user._id, email, role: user.role });

  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

export const refreshToken = async (token: string) => {
  const decoded = verifyRefreshToken(token);

  const user = await User.findById(decoded.userId);
  if (!user || user.isBlocked) {
    logger.warn('Refresh token failed: invalid or blocked user', { userId: decoded.userId });
    throw new Error('Invalid refresh token');
  }

  logger.info('Access token refreshed', { userId: user._id });

  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return { accessToken: generateAccessToken(payload) };
};

export const verifyEmailWithOTP = async (email: string, otp: string) => {
  const isValid = await verifyOTP(email, otp);
  if (!isValid) {
    logger.warn('OTP verification failed', { email });
    throw new Error('Invalid or expired OTP');
  }

  const user = await User.findOneAndUpdate(
    { email },
    { isEmailVerified: true },
    { new: true },
  );

  if (user) {
    logger.info('Email verified successfully', { userId: user._id, email });
  }
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user || user.isBlocked) {
    
    logger.info('Password reset requested (user may not exist)', { email });
    return; 
  }

  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const resetToken = generateAccessToken(payload);  

  await emailService.sendPasswordResetLink(email, resetToken);

  logger.info('Password reset link sent', { userId: user._id, email });
};

export const resetPassword = async (token: string, newPassword: string) => {
  let decoded: JWTPayload;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    logger.warn('Invalid or expired reset token used');
    throw new Error('Invalid or expired reset link');
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    logger.warn('Reset password failed: user not found for token');
    throw new Error('Invalid reset link');
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  logger.info('Password reset successful', { userId: user._id });
};