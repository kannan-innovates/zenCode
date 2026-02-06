import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../shared/constants/roles';


export interface IUser extends Document {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  avatarUrl?: string;
  isBlocked: boolean;
  isPremium: boolean;
  premiumExpiresAt?: Date;
  streakCount: number;
  bestStreak: number;
  lastActiveDate?: Date;
  googleId?: string;
  isEmailVerified: boolean;
  mustChangePassword: boolean;
  expertise?: string[];
  experienceLevel?: 'junior' | 'mid' | 'senior';
  createdByAdminId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CANDIDATE,
    },
    avatarUrl: String,
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    premiumExpiresAt: Date,
    streakCount: {
      type: Number,
      default: 0,
    },
    bestStreak: {
      type: Number,
      default: 0,
    },
    lastActiveDate: Date,
    googleId: String,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    expertise: {
      type: [String],
      default: [],
    },

    experienceLevel: {
      type: String,
      enum: ['junior', 'mid', 'senior'],
    },

    createdByAdminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    mustChangePassword: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ role: 1, isBlocked: 1 });

export default mongoose.model<IUser>('User', userSchema);