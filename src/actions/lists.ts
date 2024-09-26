import { defineAction } from "astro:actions";
import { isAuthorized } from "./_helpers";
import { db, eq, List } from "astro:db";

export const getLists = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;
    const lists = await db.select().from(List).where(eq(List.userId, userId));
    return lists;
  },
});
