import type { ActionAPIContext } from "astro:actions";
import { createDb } from "@/db";
import { Rest } from "ably";
import * as tables from "@/db/schema";
import { and, eq, inArray, ne } from "drizzle-orm";

export const createChannelName = (info: {
  userId: string;
  sessionId: string;
}) => {
  return `user:${info.userId}:session:${info.sessionId}`;
};

const createAbly = (env: Env) => {
  return new Rest({ key: env.ABLY_API_KEY, clientId: "server" });
};

export async function notifyOtherListUsers(
  c: ActionAPIContext,
  listId: string | string[],
) {
  const db = createDb(c.locals.env);
  const ably = createAbly(c.locals.env);

  const currentSessionId = c.locals.session?.id ?? "";

  const listUsers = await db
    .selectDistinct({
      userId: tables.ListUser.userId,
      sessionId: tables.UserSession.id,
    })
    .from(tables.ListUser)
    .innerJoin(
      tables.UserSession,
      eq(tables.ListUser.userId, tables.UserSession.userId),
    )
    .where(
      and(
        Array.isArray(listId)
          ? inArray(tables.ListUser.listId, listId)
          : eq(tables.ListUser.listId, listId),
        ne(tables.UserSession.id, currentSessionId),
      ),
    );

  if (!listUsers.length) return;

  console.log(`Notifying ${listUsers.length} channels`);

  return ably.batchPublish({
    channels: listUsers.map(createChannelName),
    messages: [{ name: "invalidate" }],
  });
}

export async function notifyUser(c: ActionAPIContext) {
  const db = createDb(c.locals.env);
  const ably = createAbly(c.locals.env);

  const currentSessionId = c.locals.session?.id ?? "";
  const currentUserId = c.locals.session?.userId ?? "";

  const otherSessions = await db
    .select({
      userId: tables.UserSession.userId,
      sessionId: tables.UserSession.id,
    })
    .from(tables.UserSession)
    .where(
      and(
        eq(tables.UserSession.userId, currentUserId),
        ne(tables.UserSession.id, currentSessionId),
      ),
    );

  if (!otherSessions) return;

  console.log(
    `Notifying ${otherSessions.length} channels for user ${currentUserId}`,
  );

  return ably.batchPublish({
    channels: otherSessions.map(createChannelName),
    messages: [{ name: "invalidate" }],
  });
}
