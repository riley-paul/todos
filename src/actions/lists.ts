import { defineAction } from "astro:actions";
import { isAuthorized } from "./_helpers";
import { and, db, desc, eq, List, ListShare, Todo, User } from "astro:db";
import { z } from "zod";
import type { ListSelect } from "@/lib/types";
import { v4 as uuid } from "uuid";
import { filterLists, filterTodos } from "./helpers/filters";

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
        },
      })
      .from(List)
      .leftJoin(ListShare, eq(ListShare.listId, List.id))
      .leftJoin(User, eq(User.id, ListShare.userId))
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
              .select()
              .from(ListShare)
              .where(eq(ListShare.listId, list.id)),
            isAuthor: list.author?.id === userId,
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
