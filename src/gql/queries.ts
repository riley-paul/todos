import { createDb } from "@/db";
import { getUserLists } from "./helpers";
import { builder } from "./gql-builder";
import { sql } from "drizzle-orm";

builder.queryFields((t) => ({
  me: t.drizzleField({
    type: "User",
    resolve: async (query, _root, _args, ctx) => {
      const db = createDb(ctx.env);
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
      const db = createDb(ctx.env);
      const userLists = await getUserLists(ctx);

      const filters = [];
      if (userLists.size) filters.push({ id: { in: [...userLists] } });
      if (!userLists.size) filters.push({ id: { eq: "none" } });

      return db.query.List.findMany(
        query({
          where: { AND: filters },
          with: { listUsers: true },

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
      const db = createDb(ctx.env);
      const userLists = await getUserLists(ctx);
      if (!userLists.has(args.listId)) return null;
      return db.query.List.findFirst(
        query({ where: { id: { eq: args.listId } } }),
      );
    },
  }),

  listUsers: t.drizzleField({
    type: ["ListUser"],
    args: { listId: t.arg.id() },
    resolve: async (query, _root, args, ctx) => {
      const db = createDb(ctx.env);
      const userLists = await getUserLists(ctx);
      if (!userLists.has(args.listId)) {
        throw new Error("You do not have access to this list");
      }
      return db.query.ListUser.findMany(
        query({
          where: { listId: { eq: args.listId } },
          orderBy: { createdAt: "desc" },
        }),
      );
    },
  }),

  todos: t.drizzleField({
    type: ["Todo"],
    args: { listId: t.arg.id({ required: false }) },
    resolve: async (query, _root, args, ctx) => {
      const db = createDb(ctx.env);
      const userLists = await getUserLists(ctx);

      const filters = [];
      if (userLists.size) filters.push({ listId: { in: [...userLists] } });
      if (!userLists.size) filters.push({ listId: { eq: "none" } });
      if (args.listId) filters.push({ listId: { eq: args.listId } });

      return db.query.Todo.findMany(query({ where: { AND: filters } }));
    },
  }),
}));
