import User, { IUser } from "../user/user.model";

class AdminRepository {

     async findUserByEmail(email: string): Promise<IUser | null> {
          return User.findOne({ email }).exec()
     }

     async createMentor(data: Partial<IUser>): Promise<IUser>{
          const user = new User(data);
          return user.save();
     }
}

export const adminRepository = new AdminRepository();