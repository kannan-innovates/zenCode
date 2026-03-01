import User, { IUser } from "../../user/user.model";
import { UserRole } from "../../../shared/constants/roles";


class AdminAuthRepository {

     async findAdminByEmail(email: string): Promise<IUser | null> {
          return User.findOne({
               email,
               role: UserRole.ADMIN,
          }).exec()
     }

     async findById(id: string): Promise<IUser | null> {
          return User.findById(id).exec();
     }
}

export const adminAuthRepository = new AdminAuthRepository();