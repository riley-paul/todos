import { eq } from "drizzle-orm";
import * as tables from "@/db/schema";
import { builder } from "./gql-builder";

builder.drizzleObject("User", {
  name: "UserObjectType",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    email: t.exposeString("email"),
    avatarUrl: t.exposeString("avatarUrl", { nullable: true }),

    settingGroupCompleted: t.exposeBoolean("settingGroupCompleted"),
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
    todoCount: t.relatedCount("todos", {
      where: eq(tables.Todo.isCompleted, false),
    }),
    todos: t.relation("todos", {
      query: () => ({
        orderBy: {
          createdAt: "desc",
        },
      }),
    }),
    show: t.boolean({
      select: { with: { listUsers: true } },
      resolve: async (list, _args, ctx) => {
        const listUser = list.listUsers.find((lu) => lu.userId === ctx.userId);
        return !!listUser?.show;
      },
    }),
    order: t.int({
      select: { with: { listUsers: true } },
      resolve: async (list, _args, ctx) => {
        const listUser = list.listUsers.find((lu) => lu.userId === ctx.userId);
        return listUser?.order ?? 1_000_000;
      },
    }),
    isPending: t.boolean({
      select: { with: { listUsers: true } },
      resolve: async (list, _args, ctx) => {
        const listUser = list.listUsers.find((lu) => lu.userId === ctx.userId);
        return !!listUser?.isPending;
      },
    }),
    users: t.relation("listUsers"),
  }),
});

builder.drizzleObject("ListUser", {
  name: "ListUserObjectType",
  fields: (t) => ({
    id: t.exposeID("id"),
    listId: t.exposeID("listId"),
    userId: t.exposeID("userId"),
    isPending: t.exposeBoolean("isPending"),
    user: t.relation("user"),
  }),
});
