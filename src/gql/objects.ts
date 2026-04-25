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
    todoCount: t.relatedCount("todos"),
    todos: t.relation("todos", {
      query: () => ({
        orderBy: {
          createdAt: "desc",
        },
      }),
    }),
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
