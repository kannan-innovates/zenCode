import User, { IUser } from '../../user/user.model';
import { UserRole } from '../../../shared/constants/roles';

class MentorAuthRepository {
  async findMentorByEmail(email: string): Promise<IUser | null> {
    return User.findOne({
      email,
      role: UserRole.MENTOR,
    }).exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }
}

export const mentorAuthRepository = new MentorAuthRepository();