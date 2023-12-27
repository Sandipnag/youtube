import Joi from 'joi';

export const updateUserSchema = Joi.object({
    fullName: Joi.string().min(5).max(60)
      .messages({
        'string.min': 'Full name should have at least {#limit} characters',
        'string.max': 'Full name should not exceed {#limit} characters',
      })
      .optional(),
  
    email: Joi.string().email()
      .messages({
        'string.email': 'Please enter a valid email address',
      })
      .optional(),
  });