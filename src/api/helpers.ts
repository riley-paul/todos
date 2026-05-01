import { createDb } from "@/db";
import type { EntityType } from "@/lib/types";
import { Rest } from "ably";
import { ActionError, type ActionAPIContext } from "astro:actions";

export const ensureAuthorized = (context: ActionAPIContext) => {
  const { user } = context.locals;
  if (!user) {
    throw new ActionError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action",
    });
  }
  return user;
};

export const invalidateListUsers = async (
  context: ActionAPIContext,
  listId: string,
  entityType: EntityType,
) => {
  const { env } = context.locals;
  console.log("Invalidating list users for listId:", listId);
  const db = createDb(env);
  const ably = new Rest({
    key: env.ABLY_API_KEY,
    clientId: "server",
  });

  const listUserIds = await db.query.ListUser.findMany({
    where: { listId },
    columns: { userId: true },
  }).then((lus) => lus.map((lu) => lu.userId));

  console.log("List user IDs to invalidate:", listUserIds);

  return Promise.all(
    listUserIds.map((id) => {
      console.log("Invalidating user channel for userId:", id);
      const channel = ably.channels.get(`user:${id}`);
      return channel.publish("invalidate", {
        actionTakenBy: context.locals.user?.id,
        entityType,
      });
    }),
  );
};
