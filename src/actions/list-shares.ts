import { defineAction } from "astro:actions";
import { db, ListShare, or, eq, and } from "astro:db";
import { z } from "zod";
import { isAuthorized } from "./_helpers";

export const getListShares = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async ({ listId }, c) => {
    const userId = isAuthorized(c).id;
    const shares = await db
      .select()
      .from(ListShare)
      .where(
        and(
          eq(ListShare.listId, listId),
          or(eq(ListShare.userId, userId), eq(ListShare.sharedUserId, userId)),
        ),
      );
    return shares;
  },
});
