import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: import.meta.env.DATABASE_URL!,
  authToken: import.meta.env.DATABASE_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });
