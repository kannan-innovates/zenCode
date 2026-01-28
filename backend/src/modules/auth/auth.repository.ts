import User, { IUser } from '../user/user.model';

class AuthRepository {

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec();
  }

  async findById(userId: string): Promise<IUser | null> {
    return User.findById(userId).exec();
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data);
    return user.save();
  }

  async updateByEmail(
    email: string,
    update: Partial<IUser>,
  ): Promise<IUser | null> {
    return User.findOneAndUpdate(
      { email },
      { $set: update },
      { new: true },
    ).exec();
  }
}

export const authRepository = new AuthRepository();