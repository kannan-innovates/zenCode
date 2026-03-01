import Joi from 'joi';

export const mentorLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});