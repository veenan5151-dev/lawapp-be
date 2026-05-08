// Service for user profile and password APIs
import bcrypt from "bcryptjs";
import User from "../../models/User.js";

const userService = {
    async getProfile(userId) {
        const user = await User.findByPk(userId, { attributes: { exclude: ["password"] } });
        if (!user) throw new Error("User not found");
        return user;
    },

    async updateProfile(userId, data) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error("User not found");
        await user.update(data);
        return user;
    },

    async changePassword(userId, { oldPassword, newPassword }) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error("User not found");
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new Error("Old password is incorrect");
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
    },
};

export default userService;
