import crypto from 'crypto';
import { EmailService } from '../../shared/email/email.service';
import { CreateMentorInput } from './types/create-mentor.types';
import { adminRepository } from './admin.repository';
import { AppError } from '../../shared/utils/AppError';
import { STATUS_CODES } from '../../shared/constants/status';
import { CacheService } from '../../shared/cache/cache.service';
import { REDIS_KEYS } from '../../shared/constants/redis.keys';
import { EXPIRY_TIMES } from '../../shared/constants/expiry.constants';
import { ActivateMentorInput } from './types/activate-mentor.input.type';
import { passwordService } from '../../shared/utils/password.util';


export class AdminMentorService {
     private _emailService = new EmailService();

     async createMentor(input: {
          adminId: string;
          data: CreateMentorInput;
     }): Promise<void> {
          const { adminId, data } = input;

          const existingUser = await adminRepository.findUserByEmail(data.email);
          if (existingUser) {
               throw new AppError(
                    'User Already Exists',
                    STATUS_CODES.CONFLICT
               );
          }

          const inviteToken = crypto.randomUUID();

          await CacheService.set(
               REDIS_KEYS.MENTOR_INVITE(inviteToken),
               data.email,
               EXPIRY_TIMES.MENTOR_INVITE.SECONDS
          );

          await adminRepository.createMentor({
               data,
               createdByAdminId: adminId,
          });

          const inviteLink = `${process.env.FRONTEND_URL}/mentor/activate?token=${inviteToken}`;

          await this._emailService.sendMentorSetupLink(
               {
                    email: data.email,
                    inviteLink,
                    fullName: data.fullName
               }
          )
     }


     async activateMentor(input: ActivateMentorInput) {
          const { token, password, confirmPassword } = input;

          if (password !== confirmPassword) {
               throw new AppError(
                    'Passwords do not match',
                    STATUS_CODES.BAD_REQUEST
               )
          }
          if (password.length < 8) {
               throw new AppError(
                    'Password must be at least 8 characters',
                    STATUS_CODES.BAD_REQUEST
               );
          }

          const email = await CacheService.get<string>(
               REDIS_KEYS.MENTOR_INVITE(token)
          );

          if (!email) {
               throw new AppError(
                    'Invalid or Expired Invite Link',
                    STATUS_CODES.UNAUTHORIZED
               )
          }

          const mentor = await adminRepository.findUserByEmail(email);

          if (!mentor) {
               throw new AppError(
                    'Mentor Account not Found',
                    STATUS_CODES.NOT_FOUND
               )
          }

          if (mentor.isEmailVerified) {
               throw new AppError(
                    'Account already activated',
                    STATUS_CODES.CONFLICT
               );
          }

          const hashedPassword = await passwordService.hash(password);

          await adminRepository.activateMentor({
               userId: mentor.id,
               hashedPassword,
          });
          await CacheService.del(
               REDIS_KEYS.MENTOR_INVITE(token)
          );
     }
}

// export const adminMentorService = new AdminMentorService();