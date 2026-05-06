import express from "express";
import validate from "../../middleware/validate.js";
import authController from "./controller.js";
import authValidator from "./validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth Management APIs
 *   description: Authentication management APIs
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     VerifyOtpRequest:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         otp:
 *           type: string
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *         - newPassword
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         otp:
 *           type: string
 *         newPassword:
 *           type: string
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (with OTP verification)
 *     tags: [Auth Management APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       400:
 *         description: Email already registered
 */
router.post("/register", validate(authValidator.signup), authController.signup);

/**
 * @openapi
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for registration
 *     tags: [Auth Management APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpRequest'
 *     responses:
 *       200:
 *         description: User verified and activated
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/verify-otp", validate(authValidator.verifyOtp), authController.verifyOtp);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth Management APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", validate(authValidator.login), authController.login);

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request OTP for password reset
 *     tags: [Auth Management APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: OTP sent for password reset
 *       400:
 *         description: User not found
 */
router.post(
    "/forgot-password",
    validate(authValidator.forgotPassword),
    authController.forgotPassword,
);

/**
 * @openapi
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Auth Management APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/reset-password", validate(authValidator.resetPassword), authController.resetPassword);

export default router;
