import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import type { Environment } from "@/envs";

export const getDbUrl = (env: Environment) => {
  if (env.NODE_ENV === "development") return "file:dev.db";
  if (env.NODE_ENV === "test") return "file:test.db";
  if (env.NODE_ENV === "production") return env.DATABASE_URL;
  return "";
};

export const createDb = (env: Environment) => {
  const client = createClient({
    url: getDbUrl(env),
    authToken: env.DATABASE_AUTH_TOKEN,
  });
  return drizzle(client, { schema });
};
