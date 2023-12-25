import Joi from 'joi';

export const userAuthSchema = Joi.object({
    userName: Joi.string().min(5).max(10).required(),
    fullName: Joi.string().min(5).max(60).required(),
    email: Joi.string().email(),
    avatar: Joi.string().required().uri(),
    coverImage: Joi.string().uri(),
    password: Joi.string().min(5).max(10).required()
});