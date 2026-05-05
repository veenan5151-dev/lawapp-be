import dotenv from "dotenv";
import joi from "joi";
import { logger } from "./winston-config.js";

dotenv.config();

const envVarsSchema = joi
    .object()
    .keys({
        NODE_ENV: joi
            .string()
            .valid("production", "development", "staging", "local")
            .required()
            .default("development"),
        PORT: joi.number().positive().default(5000),

        DB_NAME: joi.string().required(),
        DB_USERNAME: joi.string().required(),
        DB_PASSWORD: joi.string().required(),
        DB_HOST: joi.string().required(),
        DB_PORT: joi.number().positive().required(),
        DB_DIALECT: joi.string().required(),
        DB_LOGGING: joi.boolean().default(false),

        // JWT_SECRET: joi.string().required(),

        // SWAGGER_USERNAME: joi.string().required(),
        // SWAGGER_PASSWORD: joi.string().required(),

        // WEB_DOMAIN: joi.string().required(),
        // SERVER_DOMAIN: joi.string().required(),

        // MAILER_SERVICE: joi.string().required(),
        // MAILER_HOST: joi.string().required(),
        // MAILER_PORT: joi.string().required(),
        // MAILER_AUTH_USER: joi.string().required(),
        // MAILER_AUTH_PASS: joi.string().required(),
        // MAILER_NAME: joi.string().required(),

        // S3_ACCESS_KEY_ID: joi.string().required(),
        // S3_SECRET_ACCESS_KEY: joi.string().required(),
        // S3_REGION: joi.string().required(),
        // S3_BUCKET_NAME: joi.string().required(),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);
// console.log('process.env', envVarsSchema);

if (error) {
    logger.error(`Config validation error: ${error.message}`);
    process.exit();
}

export default envVars;
