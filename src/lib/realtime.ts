import { createDb } from "@/db";
import { Rest } from "ably";
import * as tables from "@/db/schema";
import { and, eq, inArray, ne } from "drizzle-orm";
import type { BuilderContext } from "@/gql/gql-builder";

export const createChannelName = (info: {
  userId: string;
  sessionId: string;
}) => {
  return `user:${info.userId}:session:${info.sessionId}`;
};

const createAbly = (env: Env) => {
  return new Rest({ key: env.ABLY_API_KEY, clientId: "server" });
};

const getListIds = (listId: string | string[]) => {
  const array = Array.isArray(listId) ? listId : [listId];
  const unique = [...new Set(array)];
  return unique;
};

export async function notifyOtherListUsers(
  ctx: BuilderContext,
  listId: string | string[],
) {
  const db = createDb(ctx.env);
  const ably = createAbly(ctx.env);

  const listIds = getListIds(listId);
  if (listIds.length === 0) return;

  const currentSessionId = ctx.sessionId;

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
        inArray(tables.ListUser.listId, listIds),
        ne(tables.UserSession.id, currentSessionId),
      ),
    );

  if (!listUsers.length) return;

  console.log(`Notifying ${listUsers.length} channels`);

  return ably.batchPublish({
    channels: listUsers.map(createChannelName),
    messages: [{ name: "invalidate", data: listIds }],
  });
}

export async function notifyUser(ctx: BuilderContext) {
  const db = createDb(ctx.env);
  const ably = createAbly(ctx.env);

  const currentSessionId = ctx.sessionId;
  const currentUserId = ctx.userId;

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
