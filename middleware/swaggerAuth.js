import basicAuth from "basic-auth";

const swaggerAuth = (req, res, next) => {
    if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
        const user = basicAuth(req);

        if (
            !user ||
            user.name !== process.env.SWAGGER_USERNAME ||
            user.pass !== process.env.SWAGGER_PASSWORD
        ) {
            res.set("WWW-Authenticate", 'Basic realm="example"');
            res.status(401).send("Authentication required.");
            return;
        }

        next();
    } else {
        next();
    }
};

export default swaggerAuth;
