import Joi from 'joi';

export const loginSchema = Joi.object({
    userName: Joi.string().min(5).max(10),
    email: Joi.string().email(),
    password: Joi.string().min(5).max(10).required()
}).or('email','userName');