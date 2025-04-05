import { parseEnv } from "./envs";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(
  config({
    path: ".dev.vars",
  }),
);

const env = parseEnv(process.env);
export default env;
