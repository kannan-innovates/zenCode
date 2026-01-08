import User from '@modules/user/user.model';
import logger from '@shared/utils/logger.util';
import { uploadToS3, deleteFromS3 } from '@shared/utils/s3.util';

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId).select('-password -tempPassword -tempPasswordExpiry');
  if (!user) throw new Error('User not found');
  return user;
};

export const updateProfile = async (
  userId: string,
  updates: { fullName?: string },
) => {
  const allowedFields = ['fullName'];
  const filteredUpdates: any = {};

  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredUpdates[key] = updates[key as keyof typeof updates];
    }
  });

  if (Object.keys(filteredUpdates).length === 0) {
    throw new Error('No valid fields to update');
  }

  const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) throw new Error('User not found');

  logger.info('Profile updated', { userId, updates: filteredUpdates });
  return user;
};

export const updateAvatar = async (userId: string, file: Express.Multer.File) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Delete old avatar if exists and not default
  if (user.avatarUrl && !user.avatarUrl.includes('default')) {
    await deleteFromS3(user.avatarUrl);
  }

  const avatarUrl = await uploadToS3(file);

  user.avatarUrl = avatarUrl;
  await user.save();

  logger.info('Avatar updated', { userId });

  return { avatarUrl };
};