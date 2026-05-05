/* eslint-disable import/no-extraneous-dependencies */
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    // port: process.env.MAILER_PORT,
    secure: true,
    auth: {
        user: process.env.MAILER_AUTH_USER,
        pass: process.env.MAILER_AUTH_PASS,
    },
});

export default transporter;
