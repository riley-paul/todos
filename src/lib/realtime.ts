import type { ActionAPIContext } from "astro:actions";
import { createDb } from "@/db";
import { Rest } from "ably";
import * as tables from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";

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
  listId: string,
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
        eq(tables.ListUser.listId, listId),
        ne(tables.UserSession.id, currentSessionId),
      ),
    );

  console.log(`Notifying ${listUsers.length} channels`);

  return ably.batchPublish({
    channels: listUsers.map(createChannelName),
    messages: [{ name: "invalidate" }],
  });
}
