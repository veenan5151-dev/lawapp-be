import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "express-async-errors";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import "./config/config.js";
import "./config/index.js";
import swaggerSpec from "./config/swagger-config.js";
import { logger } from "./config/winston-config.js";
import logRequest from "./helper/logRequest.js";
import errorHandler from "./middleware/errorHandler.js";
import requestLogger from "./middleware/requestLogger.js";
import sanitizeMiddleware from "./middleware/sanitize.js";
import swaggerAuth from "./middleware/swaggerAuth.js";
import "./models/index.js";
import apiRouter from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(compression());
app.use(
    cors({
        origin: [
            /^(http|https):\/\/(localhost)(:\d+)?$/, // Localhost URLs
            /^https:\/\/[a-z0-9-]+\.inc\d+\.devtunnels\.ms(\/.*)?$/, // Dev Tunnels URLs
            process.env.WEB_DOMAIN, // Your web domain
            process.env.WEB_DOMAIN_ADMIN, // Your admin web domain
        ],
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ limit: "300mb", extended: true }));
app.use(cookieParser());
app.use(fileUpload());

if (process.env.NODE_ENV !== "production") {
    logRequest(app);
}

app.use("/", express.static("public"));

app.use(sanitizeMiddleware);
app.use(requestLogger);

app.use("/api-docs", swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRouter);

app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("API WORKING FINE!!");
});

const PORT = process.env.PORT || 3000;

process.on("uncaughtException", (error) => {
    logger.error(`Uncaught Exception: ${error.message}\n${error.stack}`);
});

process.on("unhandledRejection", (reason, promise) => {
    logger.error(`Unhandled Rejection: ${reason}\n${promise}`);
});

const server = app.listen(PORT, async () => {
    logger.info(`Server started successfully on port: ${PORT}`);
    logger.info(`App: http://localhost:${PORT}`);
    logger.info(`Swagger: http://localhost:${PORT}/api-docs`);
});

server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        logger.error(`Port ${PORT} is already in use. Trying another port...`);
        process.exit(1);
    } else if (error.code === "EACCES") {
        logger.error(`Permission denied. Cannot access port ${PORT}.`);
        process.exit(1);
    } else {
        logger.error("Server error:", error);
        process.exit(1);
    }
});

// ------------->>> Cron section <<<----------------

// cron.schedule("* * * * *", async () => {
//     const startTime = moment().format("YYYY-MM-DD HH:mm:ss");
//     console.log(`Task started at: ${startTime}`);
//     await usersEventsFailureCron();
//     const endTime = moment().format("YYYY-MM-DD HH:mm:ss");
//     console.log(`Task completed at: ${endTime}`);
// });
