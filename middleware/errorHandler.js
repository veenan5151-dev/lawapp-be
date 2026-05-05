import Joi from "joi";
import { logger } from "../config/winston-config.js";
import BadRequest from "../helper/exception/badRequest.js";
import Forbidden from "../helper/exception/forbidden.js";
import Unauthorized from "../helper/exception/unauthorized.js";
import { failedResponse } from "../helper/response.js";

export default (err, req, res, next) => {
    if (err instanceof Joi.ValidationError) {
        return res
            .status(400)
            .json(failedResponse(err.message?.replace(/"/g, ""), 400, "VALIDATION_ERROR"));
    }

    if (err instanceof BadRequest) {
        return res.status(400).json(failedResponse(err.message, err.statusCode, err.code));
    }

    if (err instanceof Unauthorized) {
        return res.status(401).json(failedResponse(err.message, err.statusCode, err.code));
    }

    if (err instanceof Forbidden) {
        return res.status(403).json(failedResponse(err.message, err.statusCode, err.code));
    }

    if (["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(err.name)) {
        return res.status(401).json(failedResponse(err.message, 401, err.name));
    }

    logger.error({
        message: err.message,
        stack: err.stack,
    });

    const { NODE_ENV } = process.env;

    const message = NODE_ENV === "production" ? "Something went wrong" : err.message;

    return res.status(500).json(failedResponse(message, 500));
};
