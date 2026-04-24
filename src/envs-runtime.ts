import { parseEnv } from "./envs";
import { config } from "dotenv";

config({ path: ".dev.vars" });

const env = parseEnv(process.env);
export default env;
