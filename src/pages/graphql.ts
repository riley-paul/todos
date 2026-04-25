import { createYoga } from "graphql-yoga";
import type { APIRoute } from "astro";
import { createDb } from "@/db";
import { env } from "cloudflare:workers";
import SchemaBuilder from "@pothos/core";
import DrizzlePlugin from "@pothos/plugin-drizzle";
import { getTableConfig } from "drizzle-orm/sqlite-core";
import relations from "@/db/relations";
import * as tables from "@/db/schema";

type DrizzleRelations = typeof relations;

export interface PothosTypes {
  DrizzleRelations: DrizzleRelations;
  Context: { userId: string };
  DefaultFieldNullability: false;
  DefaultInputFieldRequiredness: true;
}

const db = createDb(env);

const getUserLists = async (userId: string): Promise<string[]> => {
  const listUsers = await db.query.ListUser.findMany({ where: { userId } });
  return listUsers.map((lu) => lu.listId);
};

const builder = new SchemaBuilder<PothosTypes>({
  plugins: [DrizzlePlugin],
  defaultFieldNullability: false,
  defaultInputFieldRequiredness: true,
  drizzle: {
    client: db,
    getTableConfig,
    relations,
  },
});

builder.drizzleObject("User", {
  name: "UserObjectType",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    email: t.exposeString("email"),
    avatarUrl: t.exposeString("avatarUrl", { nullable: true }),
  }),
});

builder.drizzleObject("Todo", {
  name: "TodoObjectType",
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
  name: "ListObjectType",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    todoCount: t.relatedCount("todos"),
    todos: t.relation("todos"),
    show: t.boolean({
      select: { with: { listUser: true } },
      resolve: async (list, args, ctx) => {
        const listUser = list.listUser.find((lu) => lu.userId === ctx.userId);
        return !!listUser?.show;
      },
    }),
    order: t.int({
      select: { with: { listUser: true } },
      resolve: async (list, args, ctx) => {
        const listUser = list.listUser.find((lu) => lu.userId === ctx.userId);
        return listUser?.order ?? 1_000_000;
      },
    }),
    isPending: t.boolean({
      select: { with: { listUser: true } },
      resolve: async (list, args, ctx) => {
        const listUser = list.listUser.find((lu) => lu.userId === ctx.userId);
        return !!listUser?.isPending;
      },
    }),
    otherUsers: t.relation("users"),
  }),
});

builder.drizzleObject("ListUser", {
  name: "ListUserObjectType",
  fields: (t) => ({
    listId: t.exposeID("listId"),
    userId: t.exposeID("userId"),
    show: t.exposeBoolean("show"),
    isPending: t.exposeBoolean("isPending"),
  }),
});

builder.queryType({
  fields: (t) => ({
    me: t.drizzleField({
      type: "User",
      resolve: async (query, root, args, ctx) => {
        const user = await db.query.User.findFirst(
          query({ where: { id: { eq: ctx.userId } } }),
        );
        if (!user) throw new Error("User not found");
        return user;
      },
    }),
    lists: t.drizzleField({
      type: ["List"],
      resolve: async (query, root, args, ctx) => {
        const userLists = await getUserLists(ctx.userId);

        const filters = [];
        if (userLists.length) filters.push({ id: { in: userLists } });

        return db.query.List.findMany(query({ where: { AND: filters } }));
      },
    }),
    list: t.drizzleField({
      type: "List",
      nullable: true,
      args: { listId: t.arg.id() },
      resolve: async (query, root, args, ctx) => {
        const userLists = await getUserLists(ctx.userId);
        if (!userLists.includes(args.listId)) return null;

        return db.query.List.findFirst(
          query({ where: { id: { eq: args.listId } } }),
        );
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

const CreateTodoInput = builder.inputType("CreateTodoInput", {
  fields: (t) => ({
    text: t.string(),
    listId: t.id(),
  }),
});

builder.mutationType({});
builder.mutationField("createTodo", (t) =>
  t.drizzleField({
    type: "Todo",
    args: { input: t.arg({ type: CreateTodoInput }) },
    nullable: true,
    resolve: async (query, root, { input }, ctx) => {
      const userLists = await getUserLists(ctx.userId);
      if (!userLists.includes(input.listId)) {
        throw new Error("You do not have access to this list");
      }
      const [newTodo] = await db
        .insert(tables.Todo)
        .values({
          text: input.text,
          listId: input.listId,
          userId: ctx.userId,
        })
        .returning();

      return db.query.Todo.findFirst(
        query({ where: { id: { eq: newTodo.id } } }),
      );
    },
  }),
);

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
