import type { ActionAPIContext } from "astro/actions/runtime/utils.js";
import { ListUser } from "@/db/schema";
import { eq, and, not } from "drizzle-orm";
import actionErrors from "./errors";
import { createDb } from "@/db";
import { Rest } from "ably";

export const ensureAuthorized = (context: ActionAPIContext) => {
  const { user } = context.locals;
  if (!user) throw actionErrors.UNAUTHORIZED;
  return user;
};

export const invalidateListUsers = async (
  context: ActionAPIContext,
  listId: string,
) => {
  console.log("Invalidating list users for listId:", listId);
  const db = createDb(context.locals.runtime.env);
  const userId = ensureAuthorized(context).id;
  const ably = new Rest({
    key: context.locals.runtime.env.ABLY_API_KEY,
    clientId: "server",
  });

  const listUserIds = await db
    .select({ id: ListUser.userId })
    .from(ListUser)
    .where(and(eq(ListUser.listId, listId), not(eq(ListUser.userId, userId))))
    .then((rows) => rows.map(({ id }) => id));

  console.log("List user IDs to invalidate:", listUserIds);

  return Promise.all(
    listUserIds.map((id) => {
      console.log("Invalidating user channel for userId:", id);
      const channel = ably.channels.get(`user:${id}`);
      return channel.publish("invalidate", { actionTakenBy: userId });
    }),
  );
};

type EnsureListMemberArgs = {
  listId: string;
  userId: string;
  checkPending?: boolean;
};
export const ensureListMember = async (
  context: ActionAPIContext,
  { listId, userId, checkPending = true }: EnsureListMemberArgs,
) => {
  const db = createDb(context.locals.runtime.env);
  const [listUser] = await db
    .select({ id: ListUser.id, isPending: ListUser.isPending })
    .from(ListUser)
    .where(and(eq(ListUser.listId, listId), eq(ListUser.userId, userId)))
    .limit(1);
  if (!listUser) throw actionErrors.NO_PERMISSION;
  if (listUser.isPending && checkPending) throw actionErrors.LIST_PENDING;
};
