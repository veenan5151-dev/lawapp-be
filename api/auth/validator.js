import Joi from "joi";

export const authValidator = {
    signup: Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),
    verifyOtp: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required(),
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
    forgotPassword: Joi.object({
        email: Joi.string().email().required(),
    }),
    resetPassword: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required(),
        newPassword: Joi.string().min(6).required(),
    }),
};

export default authValidator;
