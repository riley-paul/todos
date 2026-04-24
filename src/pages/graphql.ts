import { createYoga } from "graphql-yoga";
import type { APIRoute } from "astro";
import { createDb } from "@/db";
import { env } from "cloudflare:workers";
import SchemaBuilder from "@pothos/core";
import DrizzlePlugin from "@pothos/plugin-drizzle";
import { getTableConfig } from "drizzle-orm/sqlite-core";
import relations from "@/db/relations";

type DrizzleRelations = typeof relations;

export interface PothosTypes {
  DrizzleRelations: DrizzleRelations;
  Context: { userId: string };
}
const db = createDb(env);

const builder = new SchemaBuilder<PothosTypes>({
  plugins: [DrizzlePlugin],
  drizzle: {
    client: db, // or (ctx) => db if you want to create a request specific client
    getTableConfig,
    relations,
  },
});

const UserRef = builder.drizzleObject("User", {});

const TodoRef = builder.drizzleObject("Todo", {});

const ListRef = builder.drizzleObject("List", {});

builder.queryType({
  fields: (t) => ({
    lists: t.field({
      type: [ListRef],
      resolve: async () => {
        return db.query.List.findMany();
      },
    }),
  }),
});

export const ALL: APIRoute = async (ctx) => {
  const user = ctx.locals.user;
  if (!user) return new Response("Unauthorized", { status: 401 });

  const yoga = createYoga({
    schema: builder.toSchema(),
    context: { userId: user.id },
    fetchAPI: { Response },
  });
  return yoga(ctx.request);
};
