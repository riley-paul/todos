import { createYoga } from "graphql-yoga";
import { schema } from "@/lib/schema";
import type { APIRoute } from "astro";

const yoga = createYoga({ schema, fetchAPI: { Response } });

export const ALL: APIRoute = async (ctx) => {
  return yoga(ctx.request);
};
