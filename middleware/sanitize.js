import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const { window } = new JSDOM("");
const purify = DOMPurify(window);

const sanitizeMiddleware = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach((key) => {
            req.body[key] = purify.sanitize(req.body[key]);
        });
    }
    next();
};

export default sanitizeMiddleware;
