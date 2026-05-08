// Validator for user profile and password APIs
import Joi from "joi";

export async function validateProfileUpdate(data) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(100).optional(),
        email: Joi.string().email().optional(),
        // Add more fields as needed
    });
    await schema.validateAsync(data);
}

export async function validateChangePassword(data) {
    const schema = Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().min(6).required(),
    });
    await schema.validateAsync(data);
}
