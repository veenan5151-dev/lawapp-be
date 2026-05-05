import jwt from "jsonwebtoken";
import USER_STATUSES from "../helper/enum/userStatus.js";
import Unauthorized from "../helper/exception/unauthorized.js";
import Login from "../models/Login.js";
import User from "../models/User.js";

const verifyToken = async (req, audience) => {
    let token = req.header("Authorization");

    if (!token) {
        throw new Unauthorized("Access denied. No token provided.");
    }

    token = token.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
        throw new Unauthorized("Invalid token.");
    }

    const user = await Login.findOne({
        where: {
            id: decoded.id,
        },
        include: [
            {
                model: User,
                as: "user",
                where: {
                    is_deleted: false,
                    status: "active",
                },
            },
        ],
        raw: true,
    });

    if (!user) {
        throw new Unauthorized("Invalid token.");
    }
    req.user = {
        id: user["user.id"],
        name: `${user["user.first_name"]} ${user["user.second_name"]}`,
        email: user.email,
        role: user["user.role"],
    };

    if (!req.user) {
        throw new Unauthorized("Invalid token.");
    }

    if (req.user.status === USER_STATUSES.BLOCKED) {
        throw new Unauthorized("Your account is blocked. Please contact the admin for assistance.");
    }

    if (req.user.status === USER_STATUSES.DELETED) {
        throw new Unauthorized("User not found.");
    }

    req.token = token;
};

const auth = async (req, res, next) => {
    await verifyToken(req, "access");
    return next();
};

auth.refresh = async (req, res, next) => {
    await verifyToken(req, "refresh");
    return next();
};

export default auth;
