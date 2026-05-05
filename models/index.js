import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "../config/sequelize.js";
import { logger } from "../config/winston-config.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

function getModelFiles(dir) {
    let modelFiles = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        if (item.isDirectory()) {
            modelFiles = [...modelFiles, ...getModelFiles(`${dir}/${item.name}`)];
        } else {
            modelFiles.push(`${dir}/${item.name}`);
        }
    }

    return modelFiles
        .map((f) => f.replaceAll(`${dirname}/`, ""))
        .filter((f) => f.endsWith(".js") && !f.endsWith("index.js"));
}

function fixFunctionNamingConvention(model) {
    const builtInFunctions = ["get", "set", "create", "add", "remove", "has", "count"];

    Object.keys(model.prototype).forEach((key) => {
        if (builtInFunctions.find((v) => key.startsWith(v))) {
            const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            model.prototype[newKey] = model.prototype[key];
        }
    });
}

const files = getModelFiles(dirname);

(async () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
        // eslint-disable-next-line no-await-in-loop
        await import(`file://${path.resolve(dirname, file)}`);
    }

    Object.values(sequelize.models).forEach((model) => {
        if (model.associate) {
            model.associate(sequelize.models);
            fixFunctionNamingConvention(model);
        }
    });

    sequelize
        .sync({ force: false, alter: { drop: false } })
        .then(() => logger.info("DB synced successfully."))
        .catch((error) => logger.error("Unable to sync database:", error));
})();
