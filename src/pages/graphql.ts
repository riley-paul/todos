import { createYoga } from "graphql-yoga";
import type { APIRoute } from "astro";

import { builder } from "@/gql/gql-builder";
import "@/gql";

export const ALL: APIRoute = async (ctx) => {
  const bearerToken = ctx.request.headers
    .get("Authorization")
    ?.replace("Bearer ", "");
  const bearerTokenValid =
    bearerToken !== undefined && bearerToken === ctx.locals.env.API_KEY;

  const user = ctx.locals.user;
  if (!(user || bearerTokenValid))
    return new Response("Unauthorized", { status: 401 });

  const yoga = createYoga({
    schema: builder.toSchema(),
    context: {
      userId: ctx.locals.user?.id,
      sessionId: ctx.locals.session?.id,
      env: ctx.locals.env,
    },
    fetchAPI: { Response },
  });
  return yoga(ctx.request);
};
