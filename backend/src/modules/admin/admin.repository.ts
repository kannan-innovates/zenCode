import User, { IUser } from "../user/user.model";
import { UserRole } from "../../shared/constants/roles";
import { CreateMentorInput } from "./types/create-mentor.types";


class AdminRepository {

     async findUserByEmail(email: string): Promise<IUser | null> {
          return User.findOne({ email }).exec();
     }

     async createMentor(input: {
          data: CreateMentorInput;
          createdByAdminId: string;

     }): Promise<Partial<IUser>> {
          const { data, createdByAdminId } = input;
          return User.create({
               fullName: data.fullName,
               email: data.email,
               role: UserRole.MENTOR,
               expertise: data.expertise,
               experienceLevel: data.experienceLevel,
               isEmailVerified: false,
               mustChangePassword: true,
               createdByAdminId,
          })
     }

     async activateMentor(input: {
          userId: string;
          hashedPassword: string;
     }) {
          return User.findByIdAndUpdate(
               input.userId,
               {
                    password: input.hashedPassword,
                    isEmailVerified: true,
                    mustChangePassword: false,
               },
               { new: true }
          );
     }
}

export const adminRepository = new AdminRepository();