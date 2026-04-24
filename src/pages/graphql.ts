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

const getUserLists = async (userId: string): Promise<string[]> => {
  const listUsers = await db.query.ListUser.findMany({ where: { userId } });
  return listUsers.map((lu) => lu.listId);
};

const builder = new SchemaBuilder<PothosTypes>({
  plugins: [DrizzlePlugin],
  drizzle: {
    client: db, // or (ctx) => db if you want to create a request specific client
    getTableConfig,
    relations,
  },
});

builder.drizzleObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    email: t.exposeString("email"),
    avatarUrl: t.exposeString("avatarUrl"),
  }),
});

builder.drizzleObject("Todo", {
  fields: (t) => ({
    id: t.exposeID("id"),
    text: t.exposeString("text"),
    isCompleted: t.exposeBoolean("isCompleted"),
    isAuthor: t.boolean({
      resolve: (parent, _args, ctx) => parent.userId === ctx.userId,
    }),
    author: t.relation("author"),
    list: t.relation("list"),
  }),
});

builder.drizzleObject("List", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    todoCount: t.relatedCount("todos"),
    todos: t.relation("todos"),
  }),
});

builder.queryType({
  fields: (t) => ({
    lists: t.drizzleField({
      type: ["List"],
      resolve: async (query, root, args, ctx) => {
        const userLists = await getUserLists(ctx.userId);

        const filters = [];
        if (userLists.length) filters.push({ id: { in: userLists } });

        return db.query.List.findMany(query({ where: { AND: filters } }));
      },
    }),
    todos: t.drizzleField({
      type: ["Todo"],
      args: { listId: t.arg.id({ required: false }) },
      resolve: async (query, root, args, ctx) => {
        const userLists = await getUserLists(ctx.userId);

        const filters = [];
        if (userLists.length) filters.push({ listId: { in: userLists } });
        if (args.listId) filters.push({ listId: { eq: args.listId } });

        return db.query.Todo.findMany(query({ where: { AND: filters } }));
      },
    }),
  }),
});

export const ALL: APIRoute = async (ctx) => {
  const bearerToken = ctx.request.headers
    .get("Authorization")
    ?.replace("Bearer ", "");
  const bearerTokenValid =
    bearerToken !== undefined && bearerToken === env.API_KEY;

  const user = ctx.locals.user;
  if (!(user || bearerTokenValid))
    return new Response("Unauthorized", { status: 401 });

  const yoga = createYoga({
    schema: builder.toSchema(),
    context: { userId: user?.id },
    fetchAPI: { Response },
  });
  return yoga(ctx.request);
};
