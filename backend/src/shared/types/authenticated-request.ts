
import { Request } from 'express';
import { UserRole } from '../constants/roles';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}