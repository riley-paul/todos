import { createYoga } from "graphql-yoga";
import { buildSchema } from "drizzle-graphql";
import type { APIRoute } from "astro";
import { createDb } from "@/db";

export const ALL: APIRoute = async (ctx) => {
  const db = createDb(ctx.locals.runtime.env);
  const { schema } = buildSchema(db);
  const yoga = createYoga({ schema, fetchAPI: { Response } });
  return yoga(ctx.request);
};
