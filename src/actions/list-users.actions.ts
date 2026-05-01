import { ensureAuthorized } from "@/api/helpers";
import { createDb } from "@/db";
import type { ListUserSelect } from "@/lib/types";
import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import * as tables from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { notifyListUsers } from "@/lib/realtime";

export const populate = defineAction({
  handler: async (_, c): Promise<ListUserSelect[]> => {
    const db = createDb(c.locals.env);
    const userId = ensureAuthorized(c).id;

    const userListIds = await db.query.ListUser.findMany({
      where: { userId },
    }).then((uls) => uls.map((ul) => ul.listId));

    return db.query.ListUser.findMany({
      where: { listId: { in: userListIds } },
    });
  },
});

export const acceptInvite = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async ({ listId }, c): Promise<ListUserSelect> => {
    const db = createDb(c.locals.env);
    const userId = ensureAuthorized(c).id;
    const invite = await db.query.ListUser.findFirst({
      where: { listId, userId, isPending: true },
    });

    if (!invite) {
      throw new ActionError({ code: "NOT_FOUND", message: "Invite not found" });
    }

    const [updated] = await db
      .update(tables.ListUser)
      .set({ isPending: false, show: true })
      .where(
        and(
          eq(tables.ListUser.listId, listId),
          eq(tables.ListUser.userId, userId),
        ),
      )
      .returning();

    await notifyListUsers(c, listId, {
      entity: "listUser",
      operation: { type: "update", data: updated },
    });

    return updated;
  },
});

export const leaveList = defineAction({
  input: z.object({ listId: z.string() }),
  handler: async ({ listId }, c): Promise<boolean> => {
    const db = createDb(c.locals.env);
    const userId = ensureAuthorized(c).id;
    const membership = await db.query.ListUser.findFirst({
      where: { listId, userId },
    });

    if (!membership) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Membership not found",
      });
    }

    const [deleted] = await db
      .delete(tables.ListUser)
      .where(
        and(
          eq(tables.ListUser.listId, listId),
          eq(tables.ListUser.userId, userId),
        ),
      )
      .returning();

    await notifyListUsers(c, listId, {
      entity: "listUser",
      operation: { type: "delete", id: deleted.id },
    });

    return true;
  },
});

export const inviteToList = defineAction({
  input: z.object({ listId: z.string(), email: z.email() }),
  handler: async ({ listId, email }, c): Promise<ListUserSelect> => {
    const db = createDb(c.locals.env);
    const userId = ensureAuthorized(c).id;

    const isMember = await db.query.ListUser.findFirst({
      where: { listId, userId, isPending: false },
    });

    if (!isMember) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You are not a member of this list",
      });
    }

    const user = await db.query.User.findFirst({ where: { email } });

    if (!user) {
      throw new ActionError({ code: "NOT_FOUND", message: "User not found" });
    }

    const existingInvite = await db.query.ListUser.findFirst({
      where: { listId, userId: user.id },
    });

    if (existingInvite) {
      throw new ActionError({
        code: "CONFLICT",
        message: "User is already a member or has been invited",
      });
    }

    const [invite] = await db
      .insert(tables.ListUser)
      .values({
        listId,
        userId: user.id,
        show: true,
        isPending: true,
      })
      .returning();

    await notifyListUsers(c, listId, {
      entity: "listUser",
      operation: { type: "insert", data: invite },
    });

    return invite;
  },
});

export const removeFromList = defineAction({
  input: z.object({ listId: z.string(), userId: z.string() }),
  handler: async ({ listId, userId }, c): Promise<boolean> => {
    const db = createDb(c.locals.env);
    const currentUserId = ensureAuthorized(c).id;

    const isMember = await db.query.ListUser.findFirst({
      where: { listId, userId: currentUserId, isPending: false },
    });

    if (!isMember) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You are not a member of this list",
      });
    }

    const membership = await db.query.ListUser.findFirst({
      where: { listId, userId },
    });

    if (!membership) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Membership not found",
      });
    }

    const [deleted] = await db
      .delete(tables.ListUser)
      .where(
        and(
          eq(tables.ListUser.listId, listId),
          eq(tables.ListUser.userId, userId),
        ),
      )
      .returning();

    await notifyListUsers(c, listId, {
      entity: "listUser",
      operation: { type: "delete", id: deleted.id },
    });

    return true;
  },
});
