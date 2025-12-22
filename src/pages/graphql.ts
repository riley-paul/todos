import { createYoga } from "graphql-yoga";
import type { APIRoute } from "astro";
import { createDb } from "@/db";
import { createSchema } from "@/lib/schema";

export const ALL: APIRoute = async (ctx) => {
  const db = createDb(ctx.locals.runtime.env);
  const schema = createSchema(db);
  const yoga = createYoga({ schema, fetchAPI: { Response } });
  return yoga(ctx.request);
};
