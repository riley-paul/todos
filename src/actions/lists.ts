import { defineAction } from "astro:actions";
import { isAuthorized } from "./_helpers";
import { and, db, eq, List, ListShares } from "astro:db";
import { z } from "zod";
import type { ListSelect } from "@/lib/types";
import { v4 as uuid } from "uuid";

export const getLists = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;
    const lists = await db.select().from(List).where(eq(List.userId, userId));
    return lists;
  },
});

export const getList = defineAction({
  input: z.object({ id: z.string() }),
  handler: async ({ id }, c) => {
    const userId = isAuthorized(c).id;
    const list = await db
      .select()
      .from(List)
      .where(and(eq(List.id, id), eq(List.userId, userId)))
      .then((rows) => rows[0]);

    const shares = await db
      .select()
      .from(ListShares)
      .where(eq(ListShares.listId, id));

    return { ...list, shares };
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
