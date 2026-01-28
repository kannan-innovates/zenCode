import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../shared/constants/roles';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string; 
  role: string;
  avatarUrl?: string;
  isBlocked: boolean;
  isPremium: boolean;
  premiumExpiresAt?: Date;
  streakCount: number;
  bestStreak: number;
  lastActiveDate?: Date;
  googleId?: string; 
  isEmailVerified: boolean;
  tempPassword?: string; 
  tempPasswordExpiry?: Date;
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
    tempPassword: String,
    tempPasswordExpiry: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.index({ role: 1, isBlocked: 1 });

export default mongoose.model<IUser>('User', userSchema);