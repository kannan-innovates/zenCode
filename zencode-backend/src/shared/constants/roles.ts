// Roles in the system

export enum UserRole {
  CANDIDATE = 'candidate',
  MENTOR = 'mentor',
  ADMIN = 'admin',
}

// Check a role is a valide
export const isValidRole = (role: string): role is UserRole => {
  return Object.values(UserRole).includes(role as UserRole);
};