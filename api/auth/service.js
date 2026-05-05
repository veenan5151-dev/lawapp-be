import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import STATUS from "../../helper/enum/status.js";
import USER_TYPES from "../../helper/enum/userType.js";
import sendEmails from "../../helper/sendEmail.js";
import User from "../../models/User.js";

const OTP_EXPIRY_MINUTES = 10;
const ACCESS_TOKEN_EXPIRY = "8h";
const REFRESH_TOKEN_EXPIRY = "30d";

const otps = new Map(); // In-memory OTP store: { email: { otp, expiresAt } }

console.log(otps);

function generateToken(user, expiresIn) {
    return jwt.sign(
        { id: user.id, email: user.email, userType: user.userType },
        process.env.JWT_SECRET,
        { expiresIn },
    );
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const authService = {
    async signup({ name, phone, email, password }) {
        const existing = await User.findOne({ where: { email } });
        if (existing) throw new Error("Email already registered");
        const otp = generateOTP();
        otps.set(email, { otp, expiresAt: dayjs().add(OTP_EXPIRY_MINUTES, "minute") });
        await sendEmails({
            mailOptions: {
                to: email,
                subject: "Your OTP for LawApp Registration",
            },
            fileName: "otp.ejs",
            contentVarialbles: { otp },
        });
        const user = await User.create({
            name,
            phone,
            email,
            password,
            userType: USER_TYPES.USER,
        });
        return { message: "OTP sent to email", userId: user.id };
    },

    async verifyOtp({ email, otp }) {
        const record = otps.get(email);
        // if (!record || record.otp !== otp || dayjs().isAfter(record.expiresAt)) {
        //     throw new Error("Invalid or expired OTP");
        // }
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error("User not found");
        user.status = STATUS.ACTIVE;
        await user.save();
        otps.delete(email);
        return { message: "User verified and activated" };
    },

    async login({ email, password }) {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error("Invalid credentials");
        if (user.status !== STATUS.ACTIVE) throw new Error("User not active");
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Invalid credentials");
        const accessToken = generateToken(user, ACCESS_TOKEN_EXPIRY);
        const refreshToken = generateToken(user, REFRESH_TOKEN_EXPIRY);
        return { accessToken, refreshToken, user };
    },

    async forgotPassword({ email }) {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error("User not found");
        const otp = generateOTP();
        otps.set(email, { otp, expiresAt: dayjs().add(OTP_EXPIRY_MINUTES, "minute") });
        await sendEmails({
            mailOptions: {
                to: email,
                subject: "Your OTP for LawApp Password Reset",
            },
            fileName: "otp.ejs",
            contentVarialbles: { otp },
        });
        return { message: "OTP sent to email" };
    },

    async resetPassword({ email, otp, newPassword }) {
        const record = otps.get(email);
        if (!record || record.otp !== otp || dayjs().isAfter(record.expiresAt)) {
            throw new Error("Invalid or expired OTP");
        }
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error("User not found");
        user.password = newPassword;
        await user.save();
        otps.delete(email);
        return { message: "Password reset successful" };
    },
};

export default authService;
