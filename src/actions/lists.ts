import { defineAction } from "astro:actions";
import { isAuthorized } from "./_helpers";
import { and, db, eq, List, ListShare, or, Todo, User } from "astro:db";
import { z } from "zod";
import type { ListSelect } from "@/lib/types";
import { v4 as uuid } from "uuid";

export const getLists = defineAction({
  handler: async (_, c): Promise<ListSelect[]> => {
    const userId = isAuthorized(c).id;
    const listShares = await db
      .select()
      .from(ListShare)
      .where(
        or(eq(ListShare.userId, userId), eq(ListShare.sharedUserId, userId)),
      )
      .innerJoin(User, eq(User.id, ListShare.sharedUserId))
      .then((rows) =>
        rows.map((row) => ({
          ...row.ListShare,
          sharedUser: row.User,
        })),
      );

    const lists = await db
      .select()
      .from(List)
      .where(eq(List.userId, userId))
      .then((rows) =>
        rows.map((row) => ({
          ...row,
          shares: listShares.filter((share) => share.listId === row.id),
        })),
      );

    console.log(lists);
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
    await db.delete(List).where(and(eq(List.id, id), eq(List.userId, userId)));
    return true;
  },
});
