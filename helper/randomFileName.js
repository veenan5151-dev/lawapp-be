import { randomBytes } from "crypto";
import BadRequest from "./exception/badRequest.js";

const RandomFilename = (fileName) => {
    try {
        if (!fileName) return null;
        const extension = fileName.split(".").pop();
        const randomName = `${randomBytes(8).toString("hex")}.${extension}`;
        return randomName;
    } catch (e) {
        console.error("Error in name generation:", e);
        throw new BadRequest("Couldn't generate random file name", "ERROR_IN_NAME_GENERATION");
    }
};

export default RandomFilename;
