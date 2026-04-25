import { createDb } from "@/db";
import { getUserLists } from "./helpers";
import { env } from "cloudflare:workers";
import { builder } from "./gql-builder";

const db = createDb(env);

builder.queryFields((t) => ({
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
      if (userLists.size) filters.push({ id: { in: [...userLists] } });

      return db.query.List.findMany(query({ where: { AND: filters } }));
    },
  }),
  list: t.drizzleField({
    type: "List",
    nullable: true,
    args: { listId: t.arg.id() },
    resolve: async (query, root, args, ctx) => {
      const userLists = await getUserLists(ctx.userId);
      if (!userLists.has(args.listId)) return null;

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
      if (userLists.size) filters.push({ listId: { in: [...userLists] } });
      if (args.listId) filters.push({ listId: { eq: args.listId } });

      return db.query.Todo.findMany(query({ where: { AND: filters } }));
    },
  }),
}));
