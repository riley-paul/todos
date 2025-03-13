import { parseEnv } from "./envs";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

const env = parseEnv(process.env);
export default env;
