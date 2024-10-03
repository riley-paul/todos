import { defineAction } from "astro:actions";
import { isAuthorized } from "./_helpers";
import { and, db, eq, List, ListShare, or, Todo } from "astro:db";
import { z } from "zod";
import type { ListSelect } from "@/lib/types";
import { v4 as uuid } from "uuid";

export const getLists = defineAction({
  handler: async (_, c): Promise<ListSelect[]> => {
    const userId = isAuthorized(c).id;

    const lists = await db
      .select()
      .from(List)
      .leftJoin(ListShare, eq(ListShare.listId, List.id))
      .where(
        or(
          eq(List.userId, userId),
          eq(ListShare.sharedUserId, userId),
          eq(ListShare.userId, userId),
        ),
      );

    const result = lists.reduce(
      (acc, val) => {
        if (!acc[val.List.id]) {
          acc[val.List.id] = {
            ...val.List,
            shares: [],
          };
        }

        const shared = val.ListShare;
        if (shared) {
          acc[val.List.id].shares.push(shared);
        }
        return acc;
      },
      {} as Record<string, ListSelect>,
    );

    return Object.values(result);
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
