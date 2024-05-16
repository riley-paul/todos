import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "@vercel/postgres";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const client = neon(import.meta.env.POSTGRES_URL!);
export const db = drizzle(client, { schema });
