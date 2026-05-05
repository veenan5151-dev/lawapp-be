import ejs from "ejs";
import { join } from "path";
import transporter from "../config/nodemailer-config.js";
import __dirname from "../path.js";

async function sendEmails({ mailOptions, fileName, contentVarialbles }) {
    const publicPath = join(__dirname, "public", "templates");

    const templatePath = join(publicPath, fileName);

    try {
        const html = await ejs.renderFile(templatePath, {
            ...contentVarialbles,
            baseurl: process.env.SERVER_DOMAIN,
        });

        const mailOption = {
            ...mailOptions,
            html,
        };
        await transporter.sendMail(mailOption);
    } catch (err) {
        console.log("err.message", err);
    }
}

export default sendEmails;
