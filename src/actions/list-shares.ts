import { ActionError, defineAction } from "astro:actions";
import { z } from "zod";
import { isAuthorized } from "./helpers";
import db from "@/db";
import { User, ListShare, List } from "@/db/schema";
import { eq, and, or, desc } from "drizzle-orm";

export const create = defineAction({
  input: z.object({
    email: z.string().email(),
    listId: z.string(),
  }),
  handler: async ({ email, listId }, c) => {
    const userId = isAuthorized(c).id;

    const sharedUser = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .then((rows) => rows[0]);

    if (!sharedUser) {
      throw new ActionError({
        message: "User with email not found",
        code: "BAD_REQUEST",
      });
    }

    if (sharedUser.id === userId) {
      throw new ActionError({
        message: "You cannot share a list with yourself",
        code: "BAD_REQUEST",
      });
    }

    const list = await db
      .select()
      .from(List)
      .where(eq(List.id, listId))
      .then((rows) => rows[0]);

    if (!list) {
      throw new ActionError({
        message: "List not found",
        code: "NOT_FOUND",
      });
    }

    if (list.userId !== userId) {
      throw new ActionError({
        message: "You do not have permission to share this list",
        code: "FORBIDDEN",
      });
    }

    const existingShares = await db
      .select()
      .from(ListShare)
      .where(
        and(
          eq(ListShare.listId, listId),
          eq(ListShare.sharedUserId, sharedUser.id),
        ),
      );

    if (existingShares.length > 0) {
      throw new ActionError({
        message: "User already has access to this list",
        code: "BAD_REQUEST",
      });
    }

    const listShare = await db
      .insert(ListShare)
      .values({
        listId,
        userId,
        sharedUserId: sharedUser.id,
      })
      .returning()
      .then((rows) => rows[0]);

    return listShare;
  },
});

export const remove = defineAction({
  input: z.object({ id: z.string() }),
  handler: async ({ id }, c) => {
    const userId = isAuthorized(c).id;
    const [share] = await db
      .select()
      .from(ListShare)
      .where(eq(ListShare.id, id));

    if (share.sharedUserId !== userId && share.userId !== userId) {
      throw new ActionError({
        message: "You do not have permission to delete this share",
        code: "FORBIDDEN",
      });
    }

    await db
      .delete(ListShare)
      .where(
        and(
          eq(ListShare.id, id),
          or(eq(ListShare.userId, userId), eq(ListShare.sharedUserId, userId)),
        ),
      );

    return true;
  },
});

export const leave = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async ({ listId }, c) => {
    const userId = isAuthorized(c).id;

    await db
      .delete(ListShare)
      .where(
        and(eq(ListShare.listId, listId), eq(ListShare.sharedUserId, userId)),
      );

    return true;
  },
});

export const accept = defineAction({
  input: z.object({ id: z.string() }),
  handler: async ({ id }, c) => {
    const userId = isAuthorized(c).id;

    const listShare = await db
      .select()
      .from(ListShare)
      .where(eq(ListShare.id, id))
      .then((rows) => rows[0]);

    if (!listShare) {
      throw new ActionError({
        message: "List share not found",
        code: "NOT_FOUND",
      });
    }

    if (listShare.sharedUserId !== userId) {
      throw new ActionError({
        message: "You do not have permission to accept this share",
        code: "FORBIDDEN",
      });
    }

    await db
      .update(ListShare)
      .set({ isPending: false })
      .where(and(eq(ListShare.id, id), eq(ListShare.sharedUserId, userId)));

    return listShare;
  },
});

export const getPending = defineAction({
  handler: async (_, c) => {
    const userId = isAuthorized(c).id;
    const listShares = await db
      .selectDistinct({
        id: ListShare.id,
        list: {
          id: List.id,
          name: List.name,
        },
        invitedBy: {
          id: User.id,
          name: User.name,
          email: User.email,
          avatarUrl: User.avatarUrl,
        },
        createdAt: ListShare.createdAt,
      })
      .from(ListShare)
      .innerJoin(User, eq(User.id, ListShare.userId))
      .innerJoin(List, eq(List.id, ListShare.listId))
      .where(
        and(eq(ListShare.sharedUserId, userId), eq(ListShare.isPending, true)),
      )
      .orderBy(desc(ListShare.createdAt));
    return listShares;
  },
});
