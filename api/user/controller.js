// Controller for user profile and password APIs
import { goodResponse } from "../../helper/response.js";
import userService from "./service.js";
import { validateChangePassword, validateProfileUpdate } from "./validator.js";

export async function getProfile(req, res) {
    try {
        const user = await userService.getProfile(req.user.id);
        return res.json(goodResponse({ user }, "User profile retrieved successfully"));
    } catch (err) {
        return response.error(res, err);
    }
}

export async function updateProfile(req, res) {
    try {
        await validateProfileUpdate(req.body);
        await userService.updateProfile(req.user.id, req.body);
        return res.json(goodResponse({}, "User profile updated successfully"));
    } catch (err) {
        return response.error(res, err);
    }
}

export async function changePassword(req, res) {
    try {
        await validateChangePassword(req.body);
        await userService.changePassword(req.user.id, req.body);
        return res.json(goodResponse({}, "Password changed successfully"));
    } catch (err) {
        return response.error(res, err);
    }
}
