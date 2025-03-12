import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import env from "@/envs";

export const getDbUrl = () => {
  if (env.NODE_ENV === "development") return "file:dev.db";
  if (env.NODE_ENV === "test") return "file:test.db";
  if (env.NODE_ENV === "production") return env.DATABASE_URL;
  return "";
};

const client = createClient({
  url: getDbUrl(),
  authToken: env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client, { schema });
export default db;
