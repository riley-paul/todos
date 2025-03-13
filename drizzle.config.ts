import { defineConfig } from "drizzle-kit";
import env from "./src/envs-runtime";
import { getDbUrl } from "@/db";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: getDbUrl(env),
    authToken: env.DATABASE_AUTH_TOKEN,
  },
});
