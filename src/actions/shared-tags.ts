import { defineAction } from "astro:actions";
import { isAuthorized } from "./_helpers";
import { db, SharedTags, eq, desc, and } from "astro:db";

import { v4 as uuid } from "uuid";
import { z } from "zod";

export const getSharedTags = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;
    return db
      .select()
      .from(SharedTags)
      .where(eq(SharedTags.userId, userId))
      .orderBy(desc(SharedTags.createdAt));
  },
});

export const createSharedTag = defineAction({
  input: z.object({
    tag: z.string(),
    sharedUserId: z.string(),
  }),
  handler: async ({ tag, sharedUserId }, c) => {
    const userId = isAuthorized(c).id;
    return db
      .insert(SharedTags)
      .values({
        id: uuid(),
        tag,
        userId,
        sharedUserId,
      })
      .returning()
      .then((rows) => rows[0]);
  },
});

export const deleteSharedTag = defineAction({
  input: z.object({
    id: z.string(),
  }),
  handler: async ({ id }, c) => {
    const userId = isAuthorized(c).id;
    return db
      .delete(SharedTags)
      .where(and(eq(SharedTags.id, id), eq(SharedTags.userId, userId)));
  },
});
