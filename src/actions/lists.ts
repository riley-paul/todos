import { defineAction } from "astro:actions";
import { isAuthorized } from "./_helpers";
import { and, db, eq, List } from "astro:db";
import { z } from "zod";

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
    return list;
  },
});
