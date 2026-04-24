import { createYoga } from "graphql-yoga";
import type { APIRoute } from "astro";
import { createDb } from "@/db";
import { createSchema } from "@/lib/schema";
import { env } from "cloudflare:workers";

export const ALL: APIRoute = async (ctx) => {
  const db = createDb(env);
  const schema = createSchema(db);
  const yoga = createYoga({ schema, fetchAPI: { Response } });
  return yoga(ctx.request);
};
