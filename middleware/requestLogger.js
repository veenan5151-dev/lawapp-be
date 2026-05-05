import dayjs from "dayjs";
import { httpLogger } from "../config/winston-config.js";

const requestLogger = (req, res, next) => {
    const requestTime = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS");

    const start = performance.now();

    res.once("finish", () => {
        const end = performance.now();
        const duration = end - start;

        httpLogger.http({
            id: req.id,
            method: req.method,
            url: req.originalUrl,
            timestamp: requestTime,
            ip: req.clientIp,
            userAgent: req.headers["user-agent"],
            auth: req.headers.authorization?.replace("Bearer ", ""),
            request: {
                body: req.body,
                query: req.query,
                params: req.params,
            },
            statusCode: res.statusCode,
            duration,
        });
    });

    next();
};

export default requestLogger;
