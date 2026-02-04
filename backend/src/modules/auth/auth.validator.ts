import Joi from 'joi';

export const registerSchema = Joi.object({
     email: Joi.string().email().required().messages({
          'string.email': 'Please provide a valid email',
          'any.required': 'Email is required',
     }),
     password: Joi.string().min(6).required().messages({
          'string.min': 'Password must be at least 6 characters long',
          'any.required': 'Password is required',
     }),
     fullName: Joi.string().min(2).max(50).required().messages({
          'string.min': 'Name must be at least 2 characters long',
          'any.required': 'Full Name is required',
     }),
     confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
          'any.only': 'Passwords do not match',
          'any.required': 'Confirm password is required',
     }),
});

export const verifyOtpSchema = Joi.object({
     email: Joi.string().email().required(),
     otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
          'string.length': 'OTP must be 6 digits',
          'string.pattern.base': 'OTP must contain only numbers',
     }),
});

export const resendOtpSchema = Joi.object({
     email: Joi.string().email().required(),
});

export const loginSchema = Joi.object({
     email: Joi.string().email().required(),
     password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
     email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
     token: Joi.string().required(),
     newPassword: Joi.string().min(6).required().messages({
          'string.min': 'Password must be at least 6 characters long',
          'any.required': 'Password is required',
     }),
     confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
          'any.only': 'Passwords do not match',
          'any.required': 'Confirm password is required',
     }),
});
