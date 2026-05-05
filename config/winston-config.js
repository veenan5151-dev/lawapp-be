import winston from "winston";

const TransportOptions = {
    maxsize: 20 * 1024 * 1024, // 20MB
    maxFiles: 14,
    tailable: true,
    format: winston.format.combine(winston.format.json()),
};

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss.SSS",
        }),
    ),
    transports: [
        new winston.transports.File({
            filename: "logs/combined.log",
            ...TransportOptions,
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: "logs/exceptions.log",
            ...TransportOptions,
            handleExceptions: true,
        }),
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: "logs/rejections.log",
            ...TransportOptions,
        }),
    ],
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
                winston.format.printf(
                    (info) =>
                        `${info.level}: ${info.message}${info.stack ? `\n${info.stack}` : ""}`,
                ),
            ),
            handleExceptions: true,
        }),
    );
}

export const httpLogger = winston.createLogger({
    level: "http",
    transports: [
        new winston.transports.File({
            filename: "logs/http.log",
            level: "http",
            ...TransportOptions,
            format: winston.format.printf(({ message }) => JSON.stringify(message)),
        }),
    ],
});
