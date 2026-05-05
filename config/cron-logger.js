import winston from "winston";

// Log file path
const logFilePath = "logs/cron.log";

const cronLogger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        winston.format.printf(
            ({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`,
        ),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: logFilePath, level: "info" }),
    ],
});

export default cronLogger;
