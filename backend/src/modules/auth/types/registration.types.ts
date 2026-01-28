export interface StartRegistrationInput {
     fullName: string;
     email: string;
     password: string;
     confirmPassword: string;
}

export interface VerifyRegistrationInput {
     email: string;
     otp: string;
}

export interface RegistrationCacheData {
  fullName: string;
  email: string;
  password: string;
}