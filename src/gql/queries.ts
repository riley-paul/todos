import { createDb } from "@/db";
import { getUserLists } from "./helpers";
import { env } from "cloudflare:workers";
import { builder } from "./gql-builder";
import { sql } from "drizzle-orm";

const db = createDb(env);

builder.queryFields((t) => ({
  me: t.drizzleField({
    type: "User",
    resolve: async (query, _root, _args, ctx) => {
      const user = await db.query.User.findFirst(
        query({ where: { id: { eq: ctx.userId } } }),
      );
      if (!user) throw new Error("User not found");
      return user;
    },
  }),
  lists: t.drizzleField({
    type: ["List"],
    resolve: async (query, _root, _args, ctx) => {
      const userLists = await getUserLists(ctx.userId);

      const filters = [];
      if (userLists.size) filters.push({ id: { in: [...userLists] } });
      if (!userLists.size) filters.push({ id: { eq: "none" } });

      return db.query.List.findMany(
        query({
          where: { AND: filters },
          with: { listUser: true },

          extras: {
            userSortOrder: (lists) => sql`
              (SELECT "order" FROM listUser
              WHERE listUser.listId = ${lists.id}
              AND listUser.userId = ${ctx.userId}
              LIMIT 1)
            `,
            userShowOrder: (lists) => sql`
              (SELECT "show" FROM listUser
              WHERE listUser.listId = ${lists.id}
              AND listUser.userId = ${ctx.userId}
              LIMIT 1)
            `,
          },

          orderBy: (lists, { desc }) => [
            sql`userShowOrder DESC`,
            sql`userSortOrder ASC`,
            desc(lists.createdAt),
          ],
        }),
      );
    },
  }),
  list: t.drizzleField({
    type: "List",
    nullable: true,
    args: { listId: t.arg.id() },
    resolve: async (query, _root, args, ctx) => {
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
    resolve: async (query, _root, args, ctx) => {
      const userLists = await getUserLists(ctx.userId);

      const filters = [];
      if (userLists.size) filters.push({ listId: { in: [...userLists] } });
      if (!userLists.size) filters.push({ listId: { eq: "none" } });
      if (args.listId) filters.push({ listId: { eq: args.listId } });

      return db.query.Todo.findMany(query({ where: { AND: filters } }));
    },
  }),
}));
