import { ActionError, defineAction } from "astro:actions";
import { isAuthorized } from "./_helpers";
import { db, SharedTags, eq, desc, and, User } from "astro:db";

import { v4 as uuid } from "uuid";
import { z } from "zod";

export const getSharedTags = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;
    return db
      .select()
      .from(SharedTags)
      .where(eq(SharedTags.userId, userId))
      .innerJoin(User, eq(User.id, SharedTags.sharedUserId))
      .orderBy(desc(SharedTags.createdAt));
  },
});

export const createSharedTag = defineAction({
  input: z.object({
    tag: z.string(),
    email: z.string().email(),
  }),
  handler: async ({ tag, email }, c) => {
    const userId = isAuthorized(c).id;

    const { id: sharedUserId } = await db
      .select({ id: User.id })
      .from(User)
      .where(eq(User.email, email))
      .then((rows) => rows[0]);

    if (!sharedUserId) {
      throw new ActionError({
        message: "User does not exist",
        code: "BAD_REQUEST",
      });
    }

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
    await db
      .delete(SharedTags)
      .where(and(eq(SharedTags.id, id), eq(SharedTags.userId, userId)));
    return true;
  },
});
