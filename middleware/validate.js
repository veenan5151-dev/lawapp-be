// Joi validation middleware for Express
export default function validate(schema, property = "body") {
    return (req, res, next) => {
        const { error } = schema.validate(req[property], { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                details: error.details.map((d) => d.message),
            });
        }
        next();
    };
}
