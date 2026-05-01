import { ListUser } from "@/db/schema";
import { eq, and, not } from "drizzle-orm";
import { createDb } from "@/db";
import { Rest } from "ably";
import { env } from "cloudflare:workers";
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

export const getListUsers = async (
  listId: string,
  opts: { excludePending?: boolean } = {},
): Promise<Set<string>> => {
  const db = createDb(env);

  const filters = [];
  filters.push({ listId });
  if (opts.excludePending) filters.push({ isPending: { eq: false } });

  const listUsers = await db.query.ListUser.findMany({
    where: { AND: filters },
    columns: { userId: true },
  });
  return new Set(listUsers.map(({ userId }) => userId));
};

type InvalidateListUsersArgs = {
  listId: string;
  userId: string;
};
export const invalidateListUsers = async ({
  listId,
  userId,
}: InvalidateListUsersArgs) => {
  console.log("Invalidating list users for listId:", listId);
  const db = createDb(env);
  const ably = new Rest({
    key: env.ABLY_API_KEY,
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
