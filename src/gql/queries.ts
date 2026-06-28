import { createDb } from "@/db";
import { getUserLists } from "./helpers";
import { env } from "cloudflare:workers";
import { builder } from "./gql-builder";
import { sql } from "drizzle-orm";

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
      if (!userLists.size) filters.push({ id: { eq: "none" } });

      const lists = await db.query.List.findMany(
        query({
          where: { AND: filters },
          with: { listUser: true },

          // 1. Dynamically append child values as metadata fields onto the main row
          extras: {
            userSortOrder: sql`
              (SELECT "order" FROM listUser
              WHERE listUser.listId = id
              AND listUser.userId = ${ctx.userId}
              LIMIT 1)
            `,
            userShowOrder: sql`
              (SELECT "show" FROM listUser
              WHERE listUser.listId = id
              AND listUser.userId = ${ctx.userId}
              LIMIT 1)
            `,
          },

          // 2. Use those newly created virtual column metadata flags to order the output
          orderBy: (lists, { desc, asc }) => [
            // Use the exact custom text alias assigned in the extras configuration block above
            sql`userShowOrder DESC`,
            sql`userSortOrder ASC`,
            desc(lists.createdAt),
          ],
        }),
      );

      console.log("lists", lists);

      return lists;
    },
  }),
  list: t.drizzleField({
    type: "List",
    nullable: true,
    args: { listId: t.arg.id() },
    resolve: async (query, root, args, ctx) => {
      const userLists = await getUserLists(ctx.userId);
      if (!userLists.has(args.listId)) return null;

      // .orderBy(desc(ListUser.show), asc(ListUser.order), asc(List.createdAt))

      return db.query.List.findFirst(
        query({
          where: { id: { eq: args.listId } },
          orderBy: {
            createdAt: "asc",
          },
          with: {
            listUser: {
              orderBy: {
                show: "desc",
                order: "asc",
              },
            },
          },
        }),
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
      if (!userLists.size) filters.push({ listId: { eq: "none" } });
      if (args.listId) filters.push({ listId: { eq: args.listId } });

      return db.query.Todo.findMany(query({ where: { AND: filters } }));
    },
  }),
}));
