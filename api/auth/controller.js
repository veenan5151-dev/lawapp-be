import { failedResponse, goodResponse } from "../../helper/response.js";
import { authService } from "./service.js";

export const authController = {
    async signup(req, res) {
        try {
            const result = await authService.signup(req.body);
            res.json(goodResponse(result, "Signup initiated. OTP sent."));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },

    async verifyOtp(req, res) {
        try {
            const result = await authService.verifyOtp(req.body);
            res.json(goodResponse(result, "OTP verified. User activated."));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },

    async login(req, res) {
        try {
            const result = await authService.login(req.body);
            res.json(goodResponse(result, "Login successful."));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },

    async forgotPassword(req, res) {
        try {
            const result = await authService.forgotPassword(req.body);
            res.json(goodResponse(result, "OTP sent for password reset."));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },

    async resetPassword(req, res) {
        try {
            const result = await authService.resetPassword(req.body);
            res.json(goodResponse(result, "Password reset successful."));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
};

export default authController;
