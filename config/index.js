import dotenvExpand from "dotenv-expand";
import dotenvFlow from "dotenv-flow";

const env = dotenvFlow.config();
dotenvExpand.expand(env);
