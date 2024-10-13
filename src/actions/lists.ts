import { defineAction } from "astro:actions";
import { and, db, desc, eq, List, ListShare, Todo, User } from "astro:db";
import { z } from "zod";
import type { ListSelect } from "@/lib/types";
import { v4 as uuid } from "uuid";
import { isAuthorized, filterLists, filterTodos } from "./helpers";

export const getLists = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;

    const lists: ListSelect[] = await db
      .selectDistinct({
        id: List.id,
        name: List.name,
        author: {
          id: User.id,
          name: User.name,
          email: User.email,
          avatarUrl: User.avatarUrl,
        },
      })
      .from(List)
      .leftJoin(ListShare, eq(ListShare.listId, List.id))
      .innerJoin(User, eq(User.id, List.userId))
      .where(filterLists(userId))
      .orderBy(desc(List.name))
      .then((lists) =>
        Promise.all(
          lists.map(async (list) => ({
            ...list,
            todoCount: await db
              .selectDistinct({ todoId: Todo.id })
              .from(Todo)
              .leftJoin(ListShare, eq(ListShare.listId, Todo.listId))
              .where(filterTodos(userId, list.id))
              .then((rows) => rows.length),
            shares: await db
              .selectDistinct({
                id: ListShare.id,
                user: {
                  id: User.id,
                  name: User.name,
                  email: User.email,
                  avatarUrl: User.avatarUrl,
                },
                isPending: ListShare.isPending,
              })
              .from(ListShare)
              .innerJoin(User, eq(User.id, ListShare.sharedUserId))
              .where(eq(ListShare.listId, list.id))
              .then((shares) =>
                shares.map((share) => ({
                  ...share,
                  list: { id: list.id, name: list.name, author: list.author },
                  isAuthor: share.user.id === userId,
                })),
              ),
            isAuthor: list.author.id === userId,
          })),
        ),
      );

    return lists;
  },
});

export const updateList = defineAction({
  input: z.object({
    id: z.string(),
    data: z.custom<Partial<ListSelect>>(),
  }),
  handler: async ({ id, data }, c) => {
    const userId = isAuthorized(c).id;
    const result = await db
      .update(List)
      .set(data)
      .where(and(eq(List.id, id), eq(List.userId, userId)))
      .returning()
      .then((rows) => rows[0]);
    return result;
  },
});

export const createList = defineAction({
  input: z.object({ name: z.string() }),
  handler: async ({ name }, c) => {
    const userId = isAuthorized(c).id;
    const result = await db
      .insert(List)
      .values({ id: uuid(), name, userId })
      .returning()
      .then((rows) => rows[0]);
    return result;
  },
});

export const deleteList = defineAction({
  input: z.object({ id: z.string() }),
  handler: async ({ id }, c) => {
    const userId = isAuthorized(c).id;
    await db
      .delete(Todo)
      .where(and(eq(Todo.listId, id), eq(Todo.userId, userId)));
    await db
      .delete(ListShare)
      .where(and(eq(ListShare.listId, id), eq(ListShare.userId, userId)));
    await db.delete(List).where(and(eq(List.id, id), eq(List.userId, userId)));
    return true;
  },
});
