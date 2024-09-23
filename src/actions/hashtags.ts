import { ActionError, defineAction } from "astro:actions";
import { isAuthorized, queryHashtags } from "./_helpers";
import { db, SharedTag, eq, and, User, or } from "astro:db";

import { v4 as uuid } from "uuid";
import { z } from "zod";
import { asc } from "astro:db";

export const getSharedTags = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;

    const sharedToUser = await db
      .select()
      .from(SharedTag)
      .where(eq(SharedTag.sharedUserId, userId))
      .innerJoin(User, eq(User.id, SharedTag.userId))
      .orderBy(asc(SharedTag.isPending), asc(SharedTag.createdAt));

    const sharedByUser = await db
      .select()
      .from(SharedTag)
      .where(eq(SharedTag.userId, userId))
      .innerJoin(User, eq(User.id, SharedTag.sharedUserId))
      .orderBy(asc(SharedTag.isPending), asc(SharedTag.createdAt));

    return {
      sharedToUser,
      sharedByUser,
    };
  },
});

export const getHashtags = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;
    return await queryHashtags(userId);
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
      .insert(SharedTag)
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
      .delete(SharedTag)
      .where(
        and(
          eq(SharedTag.id, id),
          or(eq(SharedTag.userId, userId), eq(SharedTag.sharedUserId, userId)),
        ),
      );
    return true;
  },
});

export const approveSharedTag = defineAction({
  input: z.object({
    id: z.string(),
  }),
  handler: async ({ id }, c) => {
    const userId = isAuthorized(c).id;
    const sharedTag = await db
      .update(SharedTag)
      .set({ isPending: false })
      .where(and(eq(SharedTag.id, id), eq(SharedTag.sharedUserId, userId)))
      .returning()
      .then((rows) => rows[0]);

    return sharedTag;
  },
});
