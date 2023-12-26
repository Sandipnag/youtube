import Joi from 'joi';

export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().min(5).max(10).required()
        .messages({
            'string.base': 'Old password must be a string',
            'string.empty': 'Old password cannot be empty',
            'string.min': 'Old password should have at least {#limit} characters',
            'string.max': 'Old password should not exceed {#limit} characters',
            'any.required': 'Old password is required',
        }),
    newPassword: Joi.string().min(5).max(10).required()
        .messages({
            'string.base': 'New password must be a string',
            'string.empty': 'New password cannot be empty',
            'string.min': 'New password should have at least {#limit} characters',
            'string.max': 'New password should not exceed {#limit} characters',
            'any.required': 'New password is required',
        }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
        .messages({
            'any.only': 'Confirm password must match the new password',
            'any.required': 'Confirm password is required',
        }),
});