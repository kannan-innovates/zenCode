import Joi from 'joi';

export const createMentorSchema = Joi.object({
  fullName: Joi.string().trim().min(3).required(),
  email: Joi.string().email().required(),
  expertise: Joi.array().items(Joi.string().trim()).min(1).required(),
  experienceLevel: Joi.string()
    .valid('junior', 'mid', 'senior')
    .required(),
});

export const activateMentorSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().required(),
});