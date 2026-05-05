const swaggerFixArrayObject = (data) => {
    if (data === null || data === undefined) {
        return [];
    }

    if (!data) {
        return [];
    }

    if (typeof data === "string") {
        try {
            if (Array.isArray(data) && typeof data[0] === "object") {
                return data;
            }

            if (typeof data === "object" && !Array.isArray(data)) {
                return [data];
            }

            return data.map((v) => JSON.parse(v));
        } catch (error) {
            return JSON.parse(`[${data}]`);
        }
    }

    return data;
};

export default swaggerFixArrayObject;
